const http = require('http');
const PORT = 5000;
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({
        status: 'success',
        message: 'It is working'
    }));
    console.log(req);
});

server.listen(PORT, () => console.log(`The app is running on port: ${PORT}`))
