import { GoogleSpreadsheet } from 'google-spreadsheet';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize the sheet
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    
    // Authenticate with Google Sheets
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    // Get all rows
    const rows = await sheet.getRows();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No cookies found' });
    }
    
    // Get the last row (latest cookie)
    const latestRow = rows[rows.length - 1];
    
    // Format the response
    const cookie = {
      timestamp: latestRow['Timestamp'],
      cookieName: latestRow['Cookie Name'],
      rawCookie: latestRow['Raw Cookie'],
      parsedData: JSON.parse(latestRow['Parsed Data'] || '{}')
    };
    
    res.status(200).json(cookie);
  } catch (error) {
    console.error('Error retrieving latest cookie:', error);
    res.status(500).json({ error: 'Failed to retrieve latest cookie: ' + error.message });
  }
}
