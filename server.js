const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// HTML page
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Local File Upload App</title>
<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height:100vh; padding:20px; }
    .container { max-width:800px; margin:0 auto; background:white; border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.3); padding:40px; }
    h1 { color:#333; margin-bottom:10px; font-size:32px; }
    .subtitle { color:#666; margin-bottom:30px; font-size:14px; }
    .upload-section { border:3px dashed #667eea; border-radius:15px; padding:40px; text-align:center; background:#f8f9ff; margin-bottom:30px; }
    .upload-icon { font-size:48px; margin-bottom:15px; }
    input[type="file"] { margin:20px 0; padding:10px; }
    .btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; border:none; padding:12px 30px; border-radius:8px; font-size:16px; font-weight:600; cursor:pointer; transition: transform 0.2s ease; }
    .btn:hover { transform: translateY(-2px); }
    .btn:disabled { opacity:0.5; cursor:not-allowed; }
    .status { margin-top:20px; padding:15px; border-radius:8px; display:none; font-weight:500; }
    .status.success { background:#d4edda; color:#155724; display:block; }
    .status.error { background:#f8d7da; color:#721c24; display:block; }
    .files-list { margin-top:30px; }
    .files-list h2 { color:#333; margin-bottom:15px; font-size:24px; }
    .file-item { background:#f8f9ff; padding:15px; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; }
    .file-name { color:#333; font-weight:500; word-break:break-all; }
    .file-actions { display:flex; gap:10px; }
    .btn-small { background:#667eea; color:white; border:none; padding:8px 16px; border-radius:6px; font-size:14px; cursor:pointer; text-decoration:none; display:inline-block; }
    .btn-small:hover { background:#5568d3; }
    .btn-delete { background:#dc3545; }
    .btn-delete:hover { background:#c82333; }
    .progress { width:100%; height:20px; background:#e0e0e0; border-radius:10px; overflow:hidden; margin:15px 0; display:none; }
    .progress-bar { height:100%; background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); width:0%; transition: width 0.3s ease; }
</style>
</head>
<body>
<div class="container">
    <h1>🚀 Local File Upload App</h1>
    <p class="subtitle">Files are saved to the 'uploads' folder on your computer</p>
    <div class="upload-section">
        <div class="upload-icon">📤</div>
        <form id="uploadForm" enctype="multipart/form-data">
            <input type="file" id="fileInput" name="file" required><br>
            <button type="submit" class="btn">Upload File</button>
        </form>
        <div class="progress" id="progress">
            <div class="progress-bar" id="progressBar"></div>
        </div>
        <div class="status" id="status"></div>
    </div>
    <div class="files-list">
        <h2>📁 Uploaded Files</h2>
        <div id="filesList"></div>
    </div>
</div>
<script>
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const filesList = document.getElementById('filesList');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');

loadFiles();

uploadForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        progress.style.display = 'block';
        progressBar.style.width = '50%';
        const response = await fetch('/upload', { method:'POST', body: formData });
        const result = await response.json();
        progressBar.style.width = '100%';

        if(response.ok){
            showStatus('File uploaded successfully!','success');
            fileInput.value='';
            loadFiles();
            setTimeout(()=>{progress.style.display='none'; progressBar.style.width='0%';},1000);
        } else {
            showStatus('Upload failed: '+result.error,'error');
        }
    } catch(err){
        showStatus('Upload failed: '+err.message,'error');
        progress.style.display='none';
    }
});

async function loadFiles() {
    try {
        const response = await fetch('/files');
        const files = await response.json();

        if (files.length === 0) {
            filesList.innerHTML = '<p style="color: #999;">No files uploaded yet</p>';
            return;
        }

        let html = '';
        for (let f of files) {
            const safeFile = JSON.stringify(f); // safe JS string
            html += 
                '<div class="file-item">' +
                    '<span class="file-name">📄 ' + f + '</span>' +
                    '<div class="file-actions">' +
                        '<a href="/download/' + encodeURIComponent(f) + '" class="btn-small" download>Download</a>' +
                        '<button class="btn-small btn-delete" onclick="deleteFile(' + safeFile + ')">Delete</button>' +
                    '</div>' +
                '</div>';
        }

        filesList.innerHTML = html;
    } catch (err) {
        console.error('Error loading files:', err);
    }
}

async function deleteFile(filename){
    if(!confirm('Are you sure you want to delete this file?')) return;
    try{
        const response = await fetch('/delete/'+encodeURIComponent(filename), { method:'DELETE' });
        if(response.ok){ showStatus('File deleted successfully!','success'); loadFiles(); }
        else showStatus('Delete failed','error');
    } catch(err){ showStatus('Delete failed: '+err.message,'error'); }
}

function showStatus(msg,type){
    status.textContent=msg;
    status.className='status '+type;
    setTimeout(()=>{status.style.display='none';},3000);
}
</script>
</body>
</html>
    `);
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ message:'File uploaded successfully', filename:req.file.filename });
});

// List files
app.get('/files', (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if(err) return res.status(500).json({ error:'Error reading files' });
        res.json(files);
    });
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    const filepath = path.join(uploadsDir, filename);
    if(!fs.existsSync(filepath)) return res.status(404).json({ error:'File not found' });
    res.download(filepath);
});

// Delete endpoint
app.delete('/delete/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    const filepath = path.join(uploadsDir, filename);
    if(!fs.existsSync(filepath)) return res.status(404).json({ error:'File not found' });
    fs.unlink(filepath, err => {
        if(err) return res.status(500).json({ error:'Error deleting file' });
        res.json({ message:'File deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║  🚀 File Upload App Running!             ║
║                                           ║
║  📍 URL: http://localhost:${PORT}            ║
║  📁 Uploads folder: ./uploads             ║
║                                           ║
║  Press Ctrl+C to stop the server          ║
╚═══════════════════════════════════════════╝
    `);
});