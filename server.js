const http = require('http');
const fs = require('fs');
const path = require('path');

// Server port and host
const PORT = 80; // Default HTTP port
const HOST = '0.0.0.0'; // Accept connections from any IP address

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        // Serve the HTML file
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Page Not Found');
    }
});

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}/`);
});