import WebSocket from 'ws';

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log(`Client connected with IP address ${socket._socket.remoteAddress}`);
});