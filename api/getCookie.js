// api/getCookie.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://jiotv.byte-vault.workers.dev/?token=42e4f5-2d863b-3c37d8-7f3f50', {
      method: 'GET',
      headers: {
        'Host': 'jiotv.byte-vault.workers.dev',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache, no-store',
        'Accept-Encoding': 'gzip'
      }
    });

    const text = await response.text();
    
    // Log the first few lines of the response for debugging
    console.log("Response received:", text.substring(0, 500) + "...");
    
    // Check if the response contains the EXTHTTP line
    const exthttpLine = text.split('\n').find(line => line.startsWith('#EXTHTTP:'));
    
    if (!exthttpLine) {
      // Check if there's any similar line
      const similarLines = text.split('\n').filter(line => line.includes('cookie') || line.includes('EXTHTTP'));
      console.log("Similar lines found:", similarLines);
      
      return res.status(404).json({ 
        error: 'EXTHTTP line not found in response',
        preview: text.substring(0, 200) + '...',
        similarLines: similarLines
      });
    }

    // Extract and parse the JSON from the EXTHTTP line
    const jsonString = exthttpLine.replace('#EXTHTTP:', '');
    const cookieData = JSON.parse(jsonString);
    
    // Set response headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Return the cookie data in JSON format
    res.status(200).json(cookieData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

// Use the correct runtime configuration for Vercel
export const config = {
  runtime: 'nodejs'
};
