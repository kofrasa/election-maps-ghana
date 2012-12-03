package com.rancard.election.common;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.appengine.api.appidentity.AppIdentityService;
import com.google.appengine.api.appidentity.AppIdentityServiceFactory;
import com.google.gdata.client.GoogleService;
import com.google.gdata.client.spreadsheet.FeedURLFactory;
import com.google.gdata.client.spreadsheet.SpreadsheetQuery;
import com.google.gdata.client.spreadsheet.SpreadsheetService;
import com.google.gdata.client.spreadsheet.WorksheetQuery;
import com.google.gdata.data.spreadsheet.ListEntry;
import com.google.gdata.data.spreadsheet.ListFeed;
import com.google.gdata.data.spreadsheet.SpreadsheetEntry;
import com.google.gdata.data.spreadsheet.SpreadsheetFeed;
import com.google.gdata.data.spreadsheet.WorksheetEntry;
import com.google.gdata.data.spreadsheet.WorksheetFeed;



public class SpreadsheetHandler {
	
	private final SpreadsheetService service;
	private final List<WorksheetEntry> worksheets;
	private final SpreadsheetEntry spreadsheetEntry;


	
	public SpreadsheetHandler(String spreadsheet) throws Exception{
		service = new SpreadsheetService("Election-Maps-Ghana");		
		
		final Credential credential = createCredential();
		service.setOAuth2Credentials(credential);	
		
		spreadsheetEntry = getSpreadsheetEntry(spreadsheet);
		worksheets = spreadsheetEntry.getWorksheets();
	}
	
	private Credential createCredential(){
		List<String> scopes = Arrays.asList("https://spreadsheets.google.com/feeds");
		AppIdentityService appIdentity = AppIdentityServiceFactory.getAppIdentityService();
		AppIdentityService.GetAccessTokenResult accessToken = appIdentity.getAccessToken(scopes);
		
		Credential creds = new Credential(BearerToken.authorizationHeaderAccessMethod());
		creds.setAccessToken(accessToken.getAccessToken());
		
		
		return creds;
	}
	
	public SpreadsheetEntry getSpreadsheetEntry(String spreadsheet) throws Exception{
		FeedURLFactory factory  = FeedURLFactory.getDefault();
		SpreadsheetQuery spreadsheetQuery = new SpreadsheetQuery(factory.getSpreadsheetsFeedUrl());		 
		spreadsheetQuery.setTitleQuery(spreadsheet);	
		spreadsheetQuery.setTitleExact(true);
		SpreadsheetFeed spreadsheetFeed = service.query(spreadsheetQuery, SpreadsheetFeed.class);	
		      
		List<SpreadsheetEntry> spreadsheets = spreadsheetFeed.getEntries();
		 
		if (spreadsheets.isEmpty()) {		 
			throw new Exception("No spreadsheets with that name");		 
		} 
		 
		return spreadsheets.get(0);		
	}
	
	public SpreadsheetEntry getSpreadsheet(){	
		return spreadsheetEntry;
	}
	
	public List<WorksheetEntry> getWorksheets(){
		return worksheets;
	}
	
	public List<ListEntry> getWorksheetEntries(String worksheetTitle, String[] columns) throws Exception{
		WorksheetEntry worksheet = null;
		for(WorksheetEntry e: worksheets){
			if(e.getTitle().getPlainText().equalsIgnoreCase(worksheetTitle)){
				worksheet = e;
				break;
			}
		}
		
		if (worksheet == null) {		 
			throw new Exception("No worksheets with that name in spreadhsheet "+ spreadsheetEntry.getTitle().getPlainText());		 
		}
		
		ListFeed list = service.getFeed(worksheet.getListFeedUrl(), ListFeed.class);		
		
		
		return list.getEntries();	
		
		
		 
	}
	
	private String [] getColumnsArray(ListEntry entry, String [] columns){
		String [] values = new String[columns.length];
		
		for(int i = 0; i<columns.length; i++){
			values[i] = entry.getCustomElements().getValue(columns[i]);
		}
		
		return values;
	}
}
