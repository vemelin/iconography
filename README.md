# Local File Upload App 🚀

A simple web application that runs on your computer for uploading and managing files.

## 📋 Installation Instructions

### 1. Install Node.js
If you don't have Node.js installed, download it from: https://nodejs.org/
(Download the LTS version)

### 2. Set Up the App

1. Create a new folder for the app (e.g., `file-upload-app`)
2. Save `server.js` and `package.json` in that folder
3. Open Terminal (Mac/Linux) or Command Prompt (Windows)
4. Navigate to the folder:
```bash
   cd path/to/file-upload-app
```

### 3. Install Dependencies

Run this command:
```bash
npm install
```

### 4. Start the Server

Run this command:
```bash
npm start
```

You should see:
```
🚀 File Upload App Running!
📍 URL: http://localhost:3000
```

### 5. Use the App

Open your web browser and go to: **http://localhost:3000**

## ✨ Features

- ✅ Upload any type of file
- ✅ View all uploaded files
- ✅ Download files
- ✅ Delete files
- ✅ Files saved to `uploads` folder in the app directory

## 🛑 To Stop the Server

Press `Ctrl+C` in the terminal

## 📁 Where Are Files Saved?

Files are saved in the `uploads` folder inside your app directory.

## 🔧 Troubleshooting

**Port 3000 already in use?**
- Edit `server.js` and change `const PORT = 3000;` to another number (e.g., 3001)

**Can't access the app?**
- Make sure the server is running (you should see the startup message)
- Try http://127.0.0.1:3000 instead# iconography
