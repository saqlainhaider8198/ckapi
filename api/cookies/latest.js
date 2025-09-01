function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Cookie Name', 'Raw Cookie', 'Parsed Data']);
    }
    
    // Add the cookie data to the sheet
    sheet.appendRow([
      data.timestamp,
      data.cookieName,
      data.raw,
      JSON.stringify(data.parsed)
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({message: 'Cookie stored successfully'}))
      .setMimetype(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.message}))
      .setMimetype(ContentService.MimeType.JSON);
  }
}

function doGet() {
  try {
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const headers = data[0];
    const rows = data.slice(1);
    
    // Format the response
    const cookies = rows.map(row => {
      const cookie = {};
      headers.forEach((header, i) => {
        cookie[header] = row[i];
      });
      
      // Parse the parsed data
      if (cookie['Parsed Data']) {
        cookie['Parsed Data'] = JSON.parse(cookie['Parsed Data']);
      }
      
      return cookie;
    });
    
    return ContentService.createTextOutput(JSON.stringify(cookies))
      .setMimetype(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.message}))
      .setMimetype(ContentService.MimeType.JSON);
  }
}
