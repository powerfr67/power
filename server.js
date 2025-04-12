app.get('/uploads/', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read uploads folder' });
            return;
        }
        res.json(files);
    });
});
