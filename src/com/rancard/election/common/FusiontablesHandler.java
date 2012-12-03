package com.rancard.election.common;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.GoogleHeaders;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.batch.BatchRequest;
import com.google.api.client.googleapis.batch.json.JsonBatchCallback;
import com.google.api.client.googleapis.extensions.appengine.auth.oauth2.AppIdentityCredential;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpContent;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.http.json.JsonHttpContent;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.Drive.Permissions.Insert;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.Permission;
import com.google.api.services.fusiontables.Fusiontables;
import com.google.api.services.fusiontables.Fusiontables.Query.Sql;
import com.google.api.services.fusiontables.FusiontablesRequest;
import com.google.api.services.fusiontables.FusiontablesRequestInitializer;
import com.google.api.services.fusiontables.FusiontablesScopes;
import com.google.api.services.fusiontables.model.Column;
import com.google.api.services.fusiontables.model.Sqlresponse;
import com.google.api.services.fusiontables.model.Table;
import com.google.api.services.fusiontables.model.TableList;
import com.google.appengine.api.appidentity.AppIdentityService;
import com.google.appengine.api.appidentity.AppIdentityServiceFactory;
import com.google.gdata.client.GoogleService;



public class FusiontablesHandler {
	public static final Column [] PRESIDENTIALTABLECOLUMNS ={new Column().setName("Region").setType("STRING"), new Column().setName("Constituency").setType("STRING"),
			new Column().setName("NDC").setType("NUMBER"), new Column().setName("GCPP").setType("NUMBER"), new Column().setName("NPP").setType("NUMBER"),
			new Column().setName("PPP").setType("NUMBER"), new Column().setName("UFP").setType("NUMBER"), new Column().setName("PNC").setType("NUMBER"),
			new Column().setName("CPP").setType("NUMBER"), new Column().setName("INDP").setType("NUMBER")};
	public static final String PRESIDENTIALTABLETITLE = "ELECTION GHANA RESULTS - PRESIDENTIAL";
	
	public static final Column [] PALIAMENTARYTABLECOLUMNS ={new Column().setName("Region").setType("STRING"), new Column().setName("Constituency").setType("STRING"),
		new Column().setName("NDC").setType("NUMBER"), new Column().setName("GCPP").setType("NUMBER"), new Column().setName("NPP").setType("NUMBER"),
		new Column().setName("PPP").setType("NUMBER"), new Column().setName("UFP").setType("NUMBER"), new Column().setName("PNC").setType("NUMBER"),
		new Column().setName("CPP").setType("NUMBER"), new Column().setName("INDP").setType("NUMBER")};
	public static final String PALIAMENTARYTABLETITLE = "ELECTION GHANA RESULTS - PALIAMENTARY";
	
	
	 private final HttpTransport TRANSPORT = new NetHttpTransport();
	 private final JsonFactory JSON_FACTORY = new JacksonFactory();	 
	 private Fusiontables tables = null;
	 private Drive drive = null;
	 
	 private Logger logger = Logger.getLogger(FusiontablesHandler.class.getName());
	  
	public FusiontablesHandler() throws Exception{	
		
		GoogleCredential credentials = new GoogleCredential.Builder()
		.setTransport(TRANSPORT)
		.setJsonFactory(JSON_FACTORY)
		.setServiceAccountId("792120445619@developer.gserviceaccount.com")
		.setServiceAccountScopes(Arrays.asList(DriveScopes.DRIVE, DriveScopes.DRIVE_FILE,FusiontablesScopes.FUSIONTABLES))
		.setServiceAccountPrivateKeyFromP12File(new File("2aaed69f4fea00f880f268388cf14019a4b4259d-privatekey.p12"))				
		.build();
		
		
		//final AppIdentityCredential credential = new AppIdentityCredential(FUSIONTABLE_SCOPE);
		 
		tables = new Fusiontables.Builder(TRANSPORT, JSON_FACTORY, credentials)
			.build();
	
		
		drive = new Drive.Builder(TRANSPORT, JSON_FACTORY, credentials).build();
		
		
	}
	
	public String createTable(String tableName, Column [] columns, List<String []> rows) throws IOException {		 
	 
	    // Create a new table	 
	    Table table = new Table();	 
	    table.setName(tableName);	 
	    table.setIsExportable(true);	 
	    table.setDescription("Sample Table");
	    
	    // Set columns for new table	 
	    table.setColumns(Arrays.asList(columns)); 
	 
	    // Adds a new column to the table.	 
	    Fusiontables.Table.Insert t = tables.table().insert(table);	
	    
	    Table r = t.execute();
	    Sql sql = tables.query().sql("INSERT INTO "+r.getTableId()+" (Region,Constituency) VALUES ('Greater Accra', 'Amasaman')");
	    sql.execute();
	    
	    //insertRows(r.getTableId(), rows);
	    
	    Permission permission = new Permission();
	    permission.setValue("rancproject@gmail.com");
	    permission.setType("user");
	    permission.setRole("owner");
	    
	    Permission s = drive.permissions().insert(r.getTableId(), permission).execute();
	    
	    return s.toPrettyString();
	    
	 
	  }
	
	public String createTable(String tableName, Column [] columns) throws IOException {		 
		 
	    // Create a new table	 
	    Table table = new Table();	 
	    table.setName(tableName);	 
	    table.setIsExportable(true);	 
	    table.setDescription("Sample Table");
	    
	    // Set columns for new table	 
	    table.setColumns(Arrays.asList(columns)); 
	 
	    // Adds a new column to the table.	 
	    Fusiontables.Table.Insert t = tables.table().insert(table);	
	    
	    Table r = t.execute();    
	    
	    
	    
	    Permission permission = new Permission();
	    permission.setValue("musteemust@gmail.com");
	    permission.setType("user");
	    permission.setRole("owner");
	    
	    drive.permissions().insert(r.getTableId(), permission).execute();
	    
	    return r.getTableId();
	    
	 
	  }
	
	public void insertRow(String tableID, Column [] columns, String[] values) throws IOException{
		//BatchRequest batch = tables.batch();
		Sql sql = tables.query().sql(createSQLInsertStatement(tableID, columns, values));
		sql.execute();
		/*sql.queue(batch, new JsonBatchCallback<Sqlresponse>() {
			
			@Override
			public void onSuccess(Sqlresponse arg0, GoogleHeaders arg1)
					throws IOException {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onFailure(GoogleJsonError arg0, GoogleHeaders arg1)
					throws IOException {
				// TODO Auto-generated method stub
				
			}
		});	
		batch.execute();*/
		
	    //return batch.execute();
	}
	
	public List<Table> getTables(String tableName) throws IOException{		
		List<Table> tables = new ArrayList<Table>();
		TableList tableList = listTables();
		
		if(tableList.getItems() == null || tableList.getItems().isEmpty()){
			return tables;
		}else{
			for(Table table: tableList.getItems()){
				if(table.getName().equalsIgnoreCase(tableName)){
					tables.add(table);
				}
			}
			return tables;
		}
		
	}
	
	public List<String> insertRows(String tableID, Column [] columns, List<String []> rows) throws IOException{
		List<String> list = new ArrayList<String>();
		int subListSize = 10;
		int currentBeginPos = 0;
		int subListEndPos = 0;
		
		while(subListEndPos < rows.size()){
			if(subListEndPos + subListSize < rows.size()){
				currentBeginPos = subListEndPos;
				subListEndPos = currentBeginPos + subListSize;
				
				
				
				//list.add(createStatements(tableID, columns, rows.subList(currentBeginPos, subListEndPos)));
				Sql sql = tables.query().sql(createStatements(tableID, columns, rows.subList(currentBeginPos, subListEndPos)));
				sql.execute().toPrettyString();
			}
			
		}	
		return list;
	}
	
	private String createStatements(String tableID, Column [] columns, List<String []> rows){
		StringBuilder insertStatements = new StringBuilder();
		
		for(int i = 0;i< rows.size(); i++){
			insertStatements.append(createSQLInsertStatement(tableID, columns, rows.get(i)));
			insertStatements.append(";");
		}
		
		return insertStatements.toString();
	}
	
	
	public String createSQLInsertStatement(String tableID, Column [] columns, String [] row){
		StringBuilder sb = new StringBuilder("INSERT INTO ");
		StringBuilder columnString = new StringBuilder("(");
		StringBuilder valuesString = new StringBuilder("(");
		
		for(int i = 0; i< row.length; i++){
			columnString.append(columns[i].getName());
			//valuesString.append(row[i]);
			
			if(row[i] == null){
				valuesString.append("''");
			}else{
				valuesString.append("'"+row[i]+"'");
			}
			
			if(i < row.length - 1){
				columnString.append(",");
				valuesString.append(",");
			}
		}
		columnString.append(")");
		valuesString.append(")");
		
		return sb.append(tableID+ " ").append(columnString.toString()+ " VALUES ").append(valuesString.toString()).toString();
	}
	
	public TableList listTables() throws IOException {
	    
	    // Fetch the table list
	    Fusiontables.Table.List listTables = tables.table().list();
	    TableList tablelist = listTables.execute();

	    if (tablelist.getItems() == null || tablelist.getItems().isEmpty()) {
	      System.out.println("No tables found!");
	      
	    }
	    
	    return tablelist;
	 }
	
	public void deleteTable(String tableID) throws IOException{
		 Fusiontables.Table.Delete d = tables.table().delete(tableID);	
		 d.execute();
	}
	
	public void deleteTables() throws IOException{
		TableList tables = listTables();
		for(Table table: tables.getItems()){
			deleteTable(table.getTableId());
		}
	}
	
	
	 

}
