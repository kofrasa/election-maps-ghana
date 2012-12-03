package com.rancard.election;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class HtmlHandler extends HttpServlet{
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String response = "";
		BufferedReader reader = null;
		File file = new File("static/result-map.html");
		try{
			
			reader = new BufferedReader(new FileReader(new File("static/result-map.html")));		
			String line = null;
		
			while((line = reader.readLine())!=null){
				response = response+line+"\n";
			}
			
			response = response.replace("{{acceptLanguageHeader}}", req.getHeader("Accept-Language"));
		}
		catch(Exception e){
			response = file.getAbsolutePath();
		}finally{
			if(reader != null){
				reader.close();
			}
		}
		
		resp.setContentType("text/html");
		resp.getWriter().println(response);
		
	}
}
