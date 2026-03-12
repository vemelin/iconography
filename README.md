# File Upload App for Vercel ☁️

A serverless file upload application that runs on Vercel with cloud storage.

## 🚀 Quick Deploy to Vercel

### Deploy with Vercel CLI

1. **Install Vercel CLI**
```bash
   npm install -g vercel
```

2. **Navigate to the project folder**
```bash
   cd file-upload-vercel
```

3. **Install dependencies**
```bash
   npm install
```

4. **Login to Vercel**
```bash
   vercel login
```

5. **Deploy**
```bash
   vercel
```

6. **Enable Vercel Blob Storage**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Blob"
   - Click "Create"

7. **Deploy to production**
```bash
   vercel --prod
```

## ✨ Features

- ✅ Upload files to Vercel Blob Storage
- ✅ List all uploaded files
- ✅ Download files
- ✅ Delete files
- ✅ Serverless - no server management
- ✅ Automatic scaling
- ✅ Fast global CDN

## 🔧 Local Development
```bash
npm install
vercel dev
```

Then open http://localhost:3000

## 📚 Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)