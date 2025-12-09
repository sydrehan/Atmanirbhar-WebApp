
import http from 'http';
import handler from './api/alerts-text.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Enable CORS for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Simple router
    if (req.url === '/api/alerts-text') {
        // Mock the Vercel request/response with standard Node http objects
        // The handler expects (req, res) where res has .status().send()
        // We need to polyfill .status() and .send() for the native Node response object
        
        res.status = (statusCode) => {
            res.statusCode = statusCode;
            return res;
        };
        
        res.send = (body) => {
            res.end(body);
        };

        await handler(req, res);
    } else {
        res.writeHead(404);
        res.end('Not Found. Try /api/alerts-text');
    }
});

server.listen(PORT, () => {
    console.log(`\n✅ Local API Server running at http://localhost:${PORT}/api/alerts-text`);
    console.log("   (This mimics how Vercel will run your API in production)\n");
});
