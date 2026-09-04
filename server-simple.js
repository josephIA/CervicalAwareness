#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/home.html') {
    res.writeHead(301, { Location: '/' });
    res.end();
    return;
  }

  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.replace(/^\//,''));
  const ext = path.extname(filePath) || '.html';

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'text/javascript';
    else if (ext === '.json') contentType = 'application/json';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Cervical Cancer Awareness System running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
