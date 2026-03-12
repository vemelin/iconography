const { put } = require('@vercel/blob');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content type must be multipart/form-data' });
    }

    // Get the boundary from content-type header
    const boundary = contentType.split('boundary=')[1];
    
    // Read the request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Parse multipart data manually
    const parts = buffer.toString('binary').split('--' + boundary);
    
    let fileBuffer = null;
    let filename = null;
    
    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const filenameMatch = part.match(/filename="(.+?)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
          
          // Extract file content (after the headers)
          const contentStart = part.indexOf('\r\n\r\n') + 4;
          const contentEnd = part.lastIndexOf('\r\n');
          const content = part.substring(contentStart, contentEnd);
          
          fileBuffer = Buffer.from(content, 'binary');
          break;
        }
      }
    }

    if (!fileBuffer || !filename) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: blob.url,
      filename: filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};