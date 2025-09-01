// api/getCookie.js
export default async function handler(req, res) {
  try {
    // Make the request without following redirects
    const response = await fetch('https://jiotv.byte-vault.workers.dev/?token=42e4f5-2d863b-3c37d8-7f3f50', {
      method: 'GET',
      headers: {
        'Host': 'jiotv.byte-vault.workers.dev',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache, no-store',
        'Accept-Encoding': 'gzip'
      },
      redirect: 'manual' // Don't follow redirects automatically
    });

    // Check if we got a redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location && location.includes('youtube.com')) {
        return res.status(400).json({ 
          error: 'Token is invalid or expired',
          message: 'The token redirects to YouTube, which indicates it is no longer valid',
          redirectUrl: location
        });
      }
    }

    // If not a redirect, process the response
    const text = await response.text();
    
    // Try to find the EXTHTTP line
    const exthttpLine = text.split('\n').find(line => line.startsWith('#EXTHTTP:'));
    
    if (!exthttpLine) {
      return res.status(404).json({ 
        error: 'EXTHTTP line not found in response',
        preview: text.substring(0, 200) + '...'
      });
    }

    // Extract and parse the JSON from the EXTHTTP line
    const jsonString = exthttpLine.replace('#EXTHTTP:', '');
    const cookieData = JSON.parse(jsonString);
    
    // Return the cookie data in JSON format
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(cookieData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const config = {
  runtime: 'nodejs'
};
