const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/socket.io.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/node_modules/socket.io-client/dist/socket.io.js'));
});

io.on('connection', (socket) => {
    socket.on('email', (data) => {
    });
});

server.listen(process.env.PORT || 3000);