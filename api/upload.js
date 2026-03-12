import { put } from '@vercel/blob';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
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
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Parse form data
    const formData = await parseMultipartForm(req);
    
    if (!formData.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { filename, buffer } = formData.file;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
    });

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: blob.url,
      filename: filename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      details: error.message 
    });
  }
}

// Helper function to parse multipart form data
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const Busboy = require('busboy');
    const busboy = Busboy({ headers: req.headers });
    const result = {};

    busboy.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        result.file = {
          filename,
          buffer: Buffer.concat(chunks),
          encoding,
          mimeType,
        };
      });
    });

    busboy.on('finish', () => {
      resolve(result);
    });

    busboy.on('error', (error) => {
      reject(error);
    });

    req.pipe(busboy);
  });
}