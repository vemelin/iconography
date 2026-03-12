import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Blob storage is connected
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json([]);
  }

  try {
    const response = await list();
    
    const files = response.blobs.map((blob) => ({
      filename: blob.pathname,
      url: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
    }));

    return res.status(200).json(files);
  } catch (error) {
    console.error('List error:', error);
    return res.status(500).json({ 
      error: 'Failed to list files from blob_uploader',
      details: error.message 
    });
  }
}