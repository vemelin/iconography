export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(500).json({ 
        error: 'Vercel Blob Storage not configured' 
      });
    }

    const { del } = await import('@vercel/blob');
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    await del(url);
    
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file: ' + error.message });
  }
}