package com.rancard.election;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.gdata.data.spreadsheet.CustomElementCollection;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gson.Gson;
import com.rancard.election.common.SpreadsheetHandler;

@SuppressWarnings("serial")
public class VoteDataHandler extends HttpServlet {

	private static final String REGION = "REGION";
	private static final String CONSTITUENCY = "CONSTITUENCY";
	Logger logger = Logger.getLogger(VoteDataHandler.class.toString());

	private static Set<String> dataKinds = new HashSet<String>(Arrays.asList(new String[] {
		"presidential-overview", 
		"presidential-constituency", 
		"parliamentary-overview",
		"parliamentary-constituency"
	}));	

	private enum Worksheet {
		PRESIDENTIAL("Presidential", new String[] { "REGION", "CONSTITUENCY","NDC", "GCPP", "NPP", "PPP", "UFP", "PNC", "CPP", "INDP" }), 
		PALIAMENTARY("Paliamentary", new String[] { "REGION", "CONSTITUENCY","CANDIDATE", "PARTY", "RESULT" });
		

		private final String sheetName;
		private final String[] sheetColumns;

		Worksheet(String sheetName, String[] sheetColumns) {
			this.sheetName = sheetName;
			this.sheetColumns = sheetColumns;
		}

		public String getWorksheetName() {
			return sheetName;
		}

		public String[] getWorksheetColumns() {
			return sheetColumns;
		}

	}

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		

		String action = req.getParameter("action");
		String value = req.getParameter("value");
		String response = "";
		String responseType = "text/plain";

		try {

			DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
			Query query = null;
			// avoid surprizes
			value = value == null? "" : value.toLowerCase();
			action = action == null? "" : action.toLowerCase();

			logger.log(Level.WARNING, "Parameters: value = "+value+" action = "+action);

			if ("get".equalsIgnoreCase(action)) {

				if (!dataKinds.contains(value)) {
					value = "presidential-overview";
				} 
				query = new Query(value);
				response = convertEntitiesToJSON(datastore.prepare(query).asIterable(), value);
				responseType = "application/json";

			}
			else if ("update".equals(action)) {
				response = organizeAndSave(value);
			} else {
				response = organizeAndSave("presidential");
			}

		} catch (Exception e) {
			
			response = "EXCEPTION " + e.getMessage();
		}
		resp.setContentType(responseType);
		resp.getWriter().println(response);
	}

	@SuppressWarnings("unchecked")
	private String convertEntitiesToJSON(Iterable<Entity> entities, String value){
		StringBuilder json = new StringBuilder();
		if("presidential-overview".equals(value)) {
			logger.log(Level.WARNING, "Parameters: value = "+value);
			json.append("{");
			for(Entity e: entities) {
				logger.log(Level.WARNING, "Parameters: region = "+e.getProperties().get(REGION));
				Map<String,Object> map = e.getProperties();
				json.append("\"" + map.get(REGION) + "\":{");
				//map.remove(REGION);
				for(String key: map.keySet()) {
					if(key.equals(REGION)){
						continue;
					}
					json.append("\"" + key + "\":");
					json.append(Integer.valueOf(map.get(key).toString())).append(",");										
				}
				json.deleteCharAt(json.length()-1);
				json.append("},");					
			}
			json.deleteCharAt(json.length()-1);
			json.append("}");
		} else if ("presidential-constituency".equals(value)) {
			Map<String,Object> table = new HashMap<String,Object>();
			Map<String,Object> region;
			Map<String,Object> constituency;
			
			for (Entity e: entities) {		
				Map<String,Object> map = e.getProperties();
				// get region
				region = (Map<String,Object>)table.get(map.get(REGION).toString());
				if (region == null) {
					region = new HashMap<String,Object>();
					table.put(map.get(REGION).toString(), region);
				}
				// get constituency
				constituency = (Map<String,Object>)region.get(map.get(CONSTITUENCY).toString());
				if (constituency == null) {
					constituency = new HashMap<String,Object>();
					region.put(map.get(CONSTITUENCY).toString(), constituency);
				}
				
				// store party results
				for (String party: map.keySet()) {
					if(party.equals(REGION)||party.equals(CONSTITUENCY)){
						continue;
					}
					constituency.put(party, Integer.valueOf(map.get(party).toString()));
				}
			}
			json.append(new Gson().toJson(table));

		} else if ("parliamentary-overview".equals(value)) {

		} else if ("parliamentary-constituency".equals(value)) {

		}

		return json.toString();
	}
	


	private String organizeAndSave(String value) throws Exception {
		String response = "";
		
		SpreadsheetHandler handler = new SpreadsheetHandler("ELECTIONS GHANA RESULT");		
		
		
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		// Make sure work sheet is one kind or the other
		if (value.equalsIgnoreCase("presidential")) {		
			Worksheet worksheet = Worksheet.PRESIDENTIAL;
			List<ListEntry> values = handler.getWorksheetEntries(worksheet.getWorksheetName());
			
			if (values == null || values.size() == 0)
				return "Nothing in spreadsheet";
			
			List<Entity> constituencies = new ArrayList<Entity>();

			long constituencyKey = 201212070000L;
			long regionKey = 2012120700L;
			
			
			String [] sheetColumns = worksheet.getWorksheetColumns();

			for (ListEntry entry : values) {				
				Entity entity = new Entity(KeyFactory.createKey("presidential-constituency", constituencyKey));				
				CustomElementCollection entryElements = entry.getCustomElements();
				
				for(int i = 0; i < sheetColumns.length; i++)
				{
					if(i <= 1){
						entity.setProperty(	sheetColumns[i], entryElements.getValue(sheetColumns[i]).trim());
					}
					else{
						entity.setProperty(sheetColumns[i],parseStringToInt(entryElements.getValue(sheetColumns[i].trim())));
					}
				}				

				constituencies.add(entity);
				constituencyKey = constituencyKey + 1;

			}

			datastore.put(constituencies);
			datastore.put(createRegions(constituencies, regionKey, worksheet));
			response = "Presidential Sheet Updated";
		}else{
			List<ListEntry> values = handler.getWorksheetEntries(value);
			String [] sheetColumns = Worksheet.PALIAMENTARY.getWorksheetColumns();
			long entryKey = 20121207000000L;
			long regionKey = 2012120700L;
			
			List<Entity> constituencyEntries = new ArrayList<Entity>();
			
			for (ListEntry entry : values) {
				Entity entity = new Entity(KeyFactory.createKey("parliamentary-constituency", entryKey));
				CustomElementCollection entryElements = entry.getCustomElements();
				
				for(int i = 0; i < sheetColumns.length; i++){
					if(i <= 3){
						entity.setProperty(	sheetColumns[i], entryElements.getValue(sheetColumns[i]).trim());
					}else{
						entity.setProperty(sheetColumns[i],parseStringToInt(entryElements.getValue(sheetColumns[i].trim())));
					}
				}
				constituencyEntries.add(entity);
				entryKey+=1;
			}
			datastore.put(constituencyEntries);
			response = value+" Sheet Updated";
		}
		return response;
	}

	private List<Entity> createRegions(List<Entity> constituencies,	long regionKey, Worksheet worksheet) {
		List<Entity> regions = new ArrayList<Entity>();

		if (worksheet == Worksheet.PRESIDENTIAL) {
			String [] sheetColumns = 	Worksheet.PRESIDENTIAL.getWorksheetColumns();
			for (Entity entity : constituencies) {
				boolean updated = false;
				

				for (Entity e : regions) {
					
					if (e.getProperty(sheetColumns[0]).toString().equalsIgnoreCase(entity.getProperty(sheetColumns[0]).toString())) {
						
						for(int i = 2; i < sheetColumns.length; i++){
							e.setProperty(sheetColumns[i],Integer.parseInt(e.getProperty(sheetColumns[i]).toString())
									+ Integer.parseInt(entity.getProperty(sheetColumns[i]).toString()));
						}						
						updated = true;
					}
				}

				if (!updated) {
					Entity newEntity = new Entity(KeyFactory.createKey("presidential-overview", regionKey));
					for(int i = 0; i< sheetColumns.length; i++){
						newEntity.setProperty(sheetColumns[i],	entity.getProperty(sheetColumns[i]));
					}					

					regions.add(newEntity);
					regionKey += 1;
				}
			}
		}

		return regions;
	}

	private int parseStringToInt(String value) {
		try {
			return Integer.parseInt(value);
		} catch (NumberFormatException e) {
			return 0;
		}

	}

}
