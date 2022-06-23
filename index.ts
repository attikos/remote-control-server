import WebSocket from 'ws';
import { mouse } from './src/modules/mouse';

const server = new WebSocket.Server({
    port: 8080
});

let sockets : WebSocket.WebSocket[] = [];
server.on('connection', function(socket) {
  sockets.push(socket);
  console.log('connect');

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg : ArrayBuffer) {
    // sockets.forEach(s => s.send('test'));
    const command = Buffer.from(msg).toString();

    if (command.match(/^mouse_/)) {
        mouse(command, sockets);
    }
    else {
        console.log('command', command);
    }
});

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    // sockets = sockets.filter(s => s !== socket);
    console.log('close');
  });
});
