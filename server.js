const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the app
const app = express();
const PORT = 80; // Use 80 for public-facing hosting, as it's the HTTP default

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Serve uploaded videos statically from /videos
app.use('/videos', express.static(path.join(__dirname, 'uploads')));

// Serve static files and handle '/upload'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route: File upload (Fix: Explicitly handle POST /upload)
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `https://powervfx.com/videos/${req.file.filename}`;
    res.json({ success: true, fileUrl }); // Respond with the file URL
});

// Route: Homepage (Simple HTML form for uploading files)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PowerVFX File Uploader</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                h1 { color: #0073e6; }
            </style>
        </head>
        <body>
            <h1>Upload a Video</h1>
            <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="video" accept="video/*" required>
                <button type="submit">Upload</button>
            </form>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost/`);
});
