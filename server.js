const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // Change to 80 if hosting publicly

// Storage configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files (videos)
app.use('/videos', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `https://powervfx.com/videos/${req.file.filename}`;
    res.json({ success: true, fileUrl });
});

// Homepage with upload form
app.get('/', (req, res) => {
    res.send(`
        <h1>Upload a Video</h1>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="video" accept="video/*">
            <button type="submit">Upload</button>
        </form>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
