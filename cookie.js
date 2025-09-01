// api/cookie.js
export default function handler(req, res) {
  // In a real implementation, you would store this in a database
  // For this example, we'll use a simple in-memory store
  // Note: This won't persist between serverless function invocations
  let cookieData = null;

  if (req.method === 'POST') {
    // Handle POST request to store cookie data
    cookieData = req.body;
    // In a real app, you would store this in a database
    res.status(200).json({ status: 'Cookie data stored', data: cookieData });
  } else if (req.method === 'GET') {
    // Handle GET request to retrieve cookie data
    if (cookieData) {
      res.status(200).json(cookieData);
    } else {
      res.status(404).json({ error: 'No cookie data found' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
