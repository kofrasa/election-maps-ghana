package com.rancard.election;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.rancard.election.common.SpreadsheetHandler;

@SuppressWarnings("serial")
public class VoteDataHandler extends HttpServlet {

	private static final String REGION = "REGION";
	private static final String CONSTITUENCY = "CONSTITUENCY";
	private static final String CONFIRMATION = "CONFIRMATION";
	private Logger logger = Logger.getLogger(VoteDataHandler.class.toString());
	private DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

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
		String region = req.getParameter("region");
		String response = "";
		String responseType = "text/plain";

		try {
			
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
				
				response = convertEntitiesToJSON(datastore.prepare(query).asIterable(), value, region);
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


	private String convertEntitiesToJSON(Iterable<Entity> entities, String value, String region){
		StringBuilder json = new StringBuilder();
		if("presidential-overview".equals(value)) {			
			json.append("{");
			for(Entity e: entities) {
				
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
			json = convertEntitiesToJSONPresidential(entities, region);

		} else if ("parliamentary-overview".equals(value)) {
			json.append("{");
			for(Entity e: entities) {
				//logger.log(Level.WARNING, "Parameters: region = "+e.getProperties().get(REGION));
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
		} else if ("parliamentary-constituency".equals(value)) {
			json =convertEntitiesToJSONPaliamentary(entities, region);
		}

		return json.toString();
	}
	
	private StringBuilder convertEntitiesToJSONPaliamentaryRegional(Iterable<Entity> entities, String region){
		
		StringBuilder json = new StringBuilder();
		List<Entity> regionEntities = new ArrayList<Entity>();
		for(Entity entity: entities){
			if(entity.getProperty(REGION).toString().equalsIgnoreCase(region)){
				regionEntities.add(entity);
			}
		}
		logger.log(Level.WARNING, " count = "+regionEntities.size());
		
		json.append("{");
		for(String constituency: getUniqueColumn(regionEntities, CONSTITUENCY)){
			json.append("\"" + constituency+"\":{");
			for(Entity regionEntity: regionEntities){
				if(regionEntity.getProperty(CONSTITUENCY).toString().equalsIgnoreCase(constituency)){
					json.append("\"" + regionEntity.getProperty("PARTY").toString()+"\":");
					json.append("["+Integer.valueOf(regionEntity.getProperty("RESULT").toString()))
						.append(",").append("\"" +regionEntity.getProperty("CANDIDATE").toString()+"\"]").append(",");
					
				}
			}
			json.deleteCharAt(json.length()-1);
			json.append("},");
		}
		json.deleteCharAt(json.length()-1);
		json.append("}");
		return json;
	}
	
	private StringBuilder convertEntitiesToJSONPaliamentary(Iterable<Entity> entities, String regionValue){
		StringBuilder json = new StringBuilder();
		
		if(regionValue == null|| regionValue.equals("")){
			json.append("{");
			for (String region: getUniqueColumn(entities, REGION)){	
				json.append("\"" +region+ "\":");
				
				json.append(convertEntitiesToJSONPaliamentaryRegional(entities, region).toString());
				json.append(",");	
			}
			json.deleteCharAt(json.length()-1);
			json.append("}");
			
		}else{
			json =convertEntitiesToJSONPaliamentaryRegional(entities, regionValue);
		}
		
		return json;
	}
	

	private List<String> getUniqueColumn(Iterable<Entity> entities, String column){
		logger.log(Level.WARNING, " count = "+column);
		List<String>  entries = new ArrayList<String>();
		for(Entity entity: entities){
			if(!entries.contains(entity.getProperty(column).toString().trim())){
				entries.add(entity.getProperty(column).toString().trim());
			}
		}
		logger.log(Level.WARNING, " count = "+column);
		return entries;
	}
	
	private StringBuilder convertEntitiesToJSONPresidentialRegional(Iterable<Entity> entities, String region){
		StringBuilder json = new StringBuilder();
		json.append("{");
		for (Entity e: entities){
			if(e.getProperty(REGION).toString().equalsIgnoreCase(region)){
				Map<String,Object> map = e.getProperties();
				json.append("\"" + map.get(CONSTITUENCY) + "\":{");
				//map.remove(REGION);
				for(String key: map.keySet()) {
					if(key.equals(REGION) || key.equals(CONSTITUENCY)){
						continue;
					}
					json.append("\"" + key + "\":");
					json.append(Integer.valueOf(map.get(key).toString())).append(",");										
				}
				json.deleteCharAt(json.length()-1);
				json.append("},");					
			}								
		}
		json.deleteCharAt(json.length()-1);
		json.append("}");
		return json;
	}
	
	private StringBuilder convertEntitiesToJSONPresidential(Iterable<Entity> entities, String regionValue){
		logger.log(Level.WARNING, "Parameters: region = "+regionValue);
		StringBuilder json = new StringBuilder();
		
		if(regionValue == null|| regionValue.equals("")){
			json.append("{");
			for (String region: getUniqueColumn(entities, REGION)){	
				json.append("\"" +region+ "\":");
				
				json.append(convertEntitiesToJSONPresidentialRegional(entities, region).toString());
				json.append(",");	
			}
			json.deleteCharAt(json.length()-1);
			json.append("}");
			
		}else{
			json =convertEntitiesToJSONPresidentialRegional(entities, regionValue);
		}
		
		return json;
	}


	private String organizeAndSave(String value) throws Exception {
		String response = "";
		
		SpreadsheetHandler handler = new SpreadsheetHandler("ELECTIONS GHANA RESULT");			
		
		
		long regionKey = 2012120700L;
		// Make sure work sheet is one kind or the other
		if (value.equalsIgnoreCase("presidential")) {		
			Worksheet worksheet = Worksheet.PRESIDENTIAL;
			List<ListEntry> values = handler.getWorksheetEntries(worksheet.getWorksheetName());
			
			if (values == null || values.size() == 0)
				return "Nothing in spreadsheet";
			
			List<Entity> constituencies = new ArrayList<Entity>();

			long constituencyKey = 201212070000L;			
			
			
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
						if(entryElements.getValue(CONFIRMATION) == null || entryElements.getValue(CONFIRMATION).equals("")){
							entity.setProperty(sheetColumns[i], 0);
						}else{
							entity.setProperty(sheetColumns[i],parseStringToInt(entryElements.getValue(sheetColumns[i].trim())));
						}
					}
				}				

				constituencies.add(entity);
				constituencyKey = constituencyKey + 1;

			}

			datastore.put(constituencies);
			datastore.put(summarisePresidentialEntities(constituencies, regionKey));
			response = "Presidential Sheet Updated";
		}else{
			List<ListEntry> values = handler.getWorksheetEntries(value);
			List<String> constituencies = new ArrayList<String>();
			List<String> parties = new ArrayList<String>();
			
			if (values == null || values.size() == 0)
				return "Nothing in spreadsheet";
			
			String [] sheetColumns = Worksheet.PALIAMENTARY.getWorksheetColumns();
			long entryKey = 20121207000000L;
			
			
			List<Entity> constituencyEntries = new ArrayList<Entity>();
			
			for (ListEntry entry : values) {
				Entity entity = new Entity(KeyFactory.createKey("parliamentary-constituency", entryKey));
				CustomElementCollection entryElements = entry.getCustomElements();
			
				
				for(int i = 0; i < sheetColumns.length; i++){
					
					if(i <= 3){
						if(i == 1){
							if(!constituencies.contains(entryElements.getValue(sheetColumns[i]).trim())){
								constituencies.add(entryElements.getValue(sheetColumns[i]).trim());
							}
						}
						if(i == 3){
							if(!parties.contains(entryElements.getValue(sheetColumns[i]).trim())){
								parties.add(entryElements.getValue(sheetColumns[i]).trim());
							}
						}
						entity.setProperty(	sheetColumns[i], entryElements.getValue(sheetColumns[i]).trim());
					}else{
						if(entryElements.getValue(CONFIRMATION) == null || entryElements.getValue(CONFIRMATION).equals("")){
							entity.setProperty("RESULT", 0);
						}else{
							entity.setProperty("RESULT",parseStringToInt(entryElements.getValue(sheetColumns[i].trim())));
						}
					}
				}
				constituencyEntries.add(entity);
				entryKey+=1;
			}
			datastore.put(constituencyEntries);
			
			
			
			datastore.put(summarisePaliamentaryEntities(constituencyEntries, constituencies, parties, value, useKey("parliamentary-overview", value)));
			response = value+" Sheet Updated";
		}
		return response;
	}
	
	private long useKey(String kind, String region){
		Query query = new Query(kind);
		long max = 0;
		for(Entity e: datastore.prepare(query).asIterable()){
			if(e.getProperty(REGION).toString().equalsIgnoreCase(region)){
				return e.getKey().getId();
			}
			if(max < e.getKey().getId()){
				max = e.getKey().getId();
			}
		}
		return (max + 1);
	}

	private Entity summarisePaliamentaryEntities(List<Entity> constituencyEntries, List<String> constituencies, 
			List<String> parties, String value, long regionKey){
		Entity entity = new Entity(KeyFactory.createKey("parliamentary-overview", regionKey));
		entity.setProperty(REGION, value.toUpperCase());
		
		for(String party: parties){
			if(party.startsWith("INDP")){
				entity.setProperty("INDP", 0);
			}else{
				entity.setProperty(party, 0);
			}
		}
		
		for(String constituency: constituencies){
			String winningParty = getWinningParty(constituencyEntries, constituency);
			//logger.log(Level.WARNING, winningParty + "\t"+constituency);
			if(!(winningParty == null)){
				if(winningParty.startsWith("INDP")){
					entity.setProperty("INDP", Integer.valueOf(entity.getProperty("INDP").toString()) + 1);
				}else{
					entity.setProperty(winningParty, Integer.valueOf(entity.getProperty(winningParty).toString()) + 1);
				}
			}
		}
		
		return entity;
	}
	
	private String getWinningParty(List<Entity> constituencyEntries, String constituency){
		String currentParty = "";
		int big = 0;
		for(Entity entity: constituencyEntries){
			if(entity.getProperty(CONSTITUENCY).toString().equalsIgnoreCase(constituency)){
				if(Integer.valueOf(entity.getProperty("RESULT").toString()) > big){
					big = Integer.valueOf(entity.getProperty("RESULT").toString());
					currentParty = entity.getProperty("PARTY").toString();
				}
			}
		}
		
		if(big == 0){
			return null;
		}
		return currentParty;
		
	}
	
	private List<Entity> summarisePresidentialEntities(List<Entity> constituencies,	long regionKey) {
		List<Entity> regions = new ArrayList<Entity>();		

		
		String [] sheetColumns = 	Worksheet.PRESIDENTIAL.getWorksheetColumns();
		logger.log(Level.SEVERE, sheetColumns.toString());
		for (Entity entity : constituencies) {
			boolean updated = false;
				

			for (Entity e : regions) {
					
					if (e.getProperty(REGION).toString().equalsIgnoreCase(entity.getProperty(REGION).toString())) {
						
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
						if(i == 1){
							continue;
						}
						newEntity.setProperty(sheetColumns[i],	entity.getProperty(sheetColumns[i]));
					}					

					regions.add(newEntity);
					regionKey += 1;
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
