const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // Change to 80 if hosting publicly

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Configure storage settings for uploaded videos
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Serve static files (videos)
app.use('/videos', express.static(path.join(__dirname, 'uploads')));

// Allow form submission and JSON responses
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Upload endpoint (Fix: Ensures `/upload` route works)
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `https://powervfx.com/videos/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

// Homepage with upload form (Fix: Added full HTML response)
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>PowerVFX Video Uploader</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                h1 { color: #0073e6; }
            </style>
        </head>
        <body>
            <h1>Upload a Video</h1>
            <form action="/upload" method="POST" enctype="multipart/form-data">
                <input type="file" name="video" accept="video/*">
                <button type="submit">Upload</button>
            </form>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
