import { del } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Blob storage is connected
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ 
      error: 'Blob storage not connected'
    });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter required' });
    }

    await del(url);

    return res.status(200).json({ 
      message: 'File deleted successfully from blob_uploader' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ 
      error: 'Failed to delete file',
      details: error.message 
    });
  }
}