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
    const exthttpLine = text.split('\n').find(line => line.startsWith('#EXTHTTP:'));
    
    if (!exthttpLine) {
      return res.status(404).json({ error: 'EXTHTTP line not found in response' });
    }

    const cookieData = JSON.parse(exthttpLine.replace('#EXTHTTP:', ''));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(cookieData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}

export const config = {
  runtime: 'nodejs22.x'
};