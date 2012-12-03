package com.rancard.election;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.*;

import org.javatuples.Decade;
import org.javatuples.Quartet;

import com.google.api.services.fusiontables.model.Table;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Text;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gson.Gson;
import com.rancard.election.common.FusiontablesHandler;
import com.rancard.election.common.SpreadsheetHandler;

@SuppressWarnings("serial")
public class VoteDataHandler extends HttpServlet {

	private static final String REGION = "REGION";
	private static final String CONSTITUENCY = "CONSTITUENCY";

	private static Set<String> dataKinds = new HashSet<String>(Arrays.asList(new String[] {
		"presidential-overview", 
		"presidential-constituency", 
		"parliamentary-overview",
		"parliamentary-constituency"
	}));	

	private enum Worksheet {
		PRESIDENTIAL("Presidential", new String[] { "REGION", "CONSTITUENCY",
				"NDC", "GCPP", "NPP", "PPP", "UFP", "PNC", "CPP", "INDP" }), 
		PALIAMENTARY(
				"Paliamentary", new String[] { "REGION", "CONSTITUENCY",
						"CANDIDATE", "PARTY", "RESULT" });

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

		Logger logger = Logger.getLogger(VoteDataHandler.class.toString());

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

			//logger.debug("Parameters: value = ")

			if ("get".equalsIgnoreCase(action)) {

				if (!dataKinds.contains(value)) {
					value = "presidential-overview";
				} 
				query = new Query(value);
				response = convertEntitiesToJSON(datastore.prepare(query).asIterable(), value);
				responseType = "application/json";

			}
			else if ("update".equals(action)) {
				Worksheet sheet = worksheetFromValue(value);
				if (sheet != null) {
					response = organizeAndSave(sheet);
				} else {
					response = organizeAndSave(Worksheet.PRESIDENTIAL);
				}
			} else {
				response = organizeAndSave(Worksheet.PRESIDENTIAL);
			}

		} catch (Exception e) {

			response = "EXCEPTION " + e.getMessage();
		}
		resp.setContentType(responseType);
		resp.getWriter().println(response);
	}

	private String convertEntitiesToJSON(Iterable<Entity> entities, String value){
		StringBuilder json = new StringBuilder();
		if("presidential-overview".equals(value)) {
			for(Entity e: entities) {
				Map<String,Object> map = e.getProperties();
				json.append("{\"" + map.get(REGION) + "\":{");
				map.remove(REGION);
				for(String key: map.keySet()) {
					json.append("\"" + key + "\":");
					json.append(map.get(key)).append(",");						
				}
				json.deleteCharAt(json.length()-1);
				json.append("},");					
			}
			json.deleteCharAt(json.length()-1);

		} else if ("presidential-constituency".equals(value)) {
			Map<String,Object> table = new HashMap<String,Object>();
			Map<String,Object> region;
			Map<String,Object> constituency;
			Map<String,Object> parties;
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

				map.remove(REGION);
				map.remove(CONSTITUENCY);
				// store party results
				for (String party: map.keySet()) {
					constituency.put(party, Integer.valueOf(map.get(party).toString()));
				}
			}
			json.append(new Gson().toJson(table));

		} else if ("parliamentary-overview".equals(value)) {

		} else if ("parliamentary-constituency".equals(value)) {

		}

		return json.toString();
	}
	
	private Worksheet worksheetFromValue(String value) {
		if (!(value == null || value.equals(""))) {
			for (Worksheet sheet : Worksheet.values()) {
				if (value.equalsIgnoreCase(sheet.getWorksheetName())) {
					return sheet;
				}
			}
		}
		return null;
	}

	private String organizeAndSave(Worksheet worksheet) throws Exception {
		String response = "";

		// Make sure work sheet is one kind or the other
		if (worksheet == Worksheet.PRESIDENTIAL) {
			SpreadsheetHandler handler = new SpreadsheetHandler(
					"ELECTIONS GHANA RESULT");
			List<ListEntry> values = handler.getWorksheetEntries(
					worksheet.getWorksheetName(),
					worksheet.getWorksheetColumns());

			if (values == null || values.size() == 0 || worksheet == null)
				return "Nothing in spreadsheet";

			DatastoreService datastore = DatastoreServiceFactory
					.getDatastoreService();
			List<Entity> constituencies = new ArrayList<Entity>();

			long constituencyKey = 201212070000L;
			long regionKey = 2012120700L;

			for (ListEntry entry : values) {

				// updateRegion(regions, s);

				Entity entity = new Entity(KeyFactory.createKey(
						"presidential-constituency", constituencyKey));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[0],
						entry.getCustomElements()
								.getValue(
										Worksheet.PRESIDENTIAL
												.getWorksheetColumns()[0])
								.trim());
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[1],
						entry.getCustomElements()
								.getValue(
										Worksheet.PRESIDENTIAL
												.getWorksheetColumns()[1])
								.trim());
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[2],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[2]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[3],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[3]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[4],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[4]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[5],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[5]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[6],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[6]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[7],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[7]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[8],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[8]
										.trim())));
				entity.setProperty(
						Worksheet.PRESIDENTIAL.getWorksheetColumns()[9],
						parseStringToInt(entry.getCustomElements().getValue(
								Worksheet.PRESIDENTIAL.getWorksheetColumns()[9]
										.trim())));

				constituencies.add(entity);
				constituencyKey = constituencyKey + 1;

			}

			datastore.put(constituencies);
			datastore.put(createRegions(constituencies, regionKey, worksheet));
			response = "Presidential Sheet Updated";
		}
		return response;
	}

	private List<Entity> createRegions(List<Entity> constituencies,
			long regionKey, Worksheet worksheet) {
		List<Entity> regions = new ArrayList<Entity>();

		if (worksheet == Worksheet.PRESIDENTIAL) {
			for (Entity entity : constituencies) {
				boolean updated = false;

				for (Entity e : regions) {
					if (e.getProperty(worksheet.getWorksheetColumns()[0])
							.toString()
							.equalsIgnoreCase(
									entity.getProperty(
											worksheet.getWorksheetColumns()[0])
											.toString())) {
						e.setProperty(
								worksheet.getWorksheetColumns()[2],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[2])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[2])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[3],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[3])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[3])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[4],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[4])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[4])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[5],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[5])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[5])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[6],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[6])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[6])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[7],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[7])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[7])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[8],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[8])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[8])
												.toString()));
						e.setProperty(
								worksheet.getWorksheetColumns()[9],
								Integer.parseInt(e.getProperty(
										worksheet.getWorksheetColumns()[9])
										.toString())
										+ Integer.parseInt(entity
												.getProperty(
														worksheet
																.getWorksheetColumns()[9])
												.toString()));

						updated = true;
					}
				}

				if (!updated) {
					Entity newEntity = new Entity(KeyFactory.createKey(
							"presidential-overview", regionKey));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[0],
									entity.getProperty(worksheet
											.getWorksheetColumns()[0]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[2],
									entity.getProperty(worksheet
											.getWorksheetColumns()[2]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[3],
									entity.getProperty(worksheet
											.getWorksheetColumns()[3]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[4],
									entity.getProperty(worksheet
											.getWorksheetColumns()[4]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[5],
									entity.getProperty(worksheet
											.getWorksheetColumns()[5]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[6],
									entity.getProperty(worksheet
											.getWorksheetColumns()[6]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[7],
									entity.getProperty(worksheet
											.getWorksheetColumns()[7]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[8],
									entity.getProperty(worksheet
											.getWorksheetColumns()[8]));
					newEntity
							.setProperty(worksheet.getWorksheetColumns()[9],
									entity.getProperty(worksheet
											.getWorksheetColumns()[9]));

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
