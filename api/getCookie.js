// api/getCookie.js
export default async function handler(req, res) {
  try {
    // Follow redirects until we get the final response
    let response = await fetch('https://jiotv.byte-vault.workers.dev/?token=42e4f5-2d863b-3c37d8-7f3f50', {
      method: 'GET',
      headers: {
        'Host': 'jiotv.byte-vault.workers.dev',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Accept': '*/*',
        'Cache-Control': 'no-cache, no-store',
        'Accept-Encoding': 'gzip'
      },
      redirect: 'follow' // This will automatically follow redirects
    });

    // Get the final URL after all redirects
    const finalUrl = response.url;
    console.log('Final URL:', finalUrl);

    // Check if we were redirected to YouTube
    if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be')) {
      return res.status(400).json({ 
        error: 'Token expired or invalid - redirected to YouTube',
        redirectUrl: finalUrl
      });
    }

    const text = await response.text();
    console.log('Response text (first 200 chars):', text.substring(0, 200));
    
    // Try to find the EXTHTTP line
    const exthttpLine = text.split('\n').find(line => line.startsWith('#EXTHTTP:'));
    
    if (!exthttpLine) {
      // Check for any line that might contain cookie data
      const cookieLine = text.split('\n').find(line => line.includes('cookie') || line.includes('hdnea'));
      
      if (cookieLine) {
        console.log('Found potential cookie line:', cookieLine);
        // Try to extract cookie data from this line
        const cookieMatch = cookieLine.match(/\{.*\}/);
        if (cookieMatch) {
          try {
            const cookieData = JSON.parse(cookieMatch[0]);
            return res.status(200).json(cookieData);
          } catch (e) {
            console.error('Failed to parse cookie data:', e);
          }
        }
      }
      
      return res.status(404).json({ 
        error: 'EXTHTTP line not found in response',
        preview: text.substring(0, 200) + '...'
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
