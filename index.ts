import WebSocket from 'ws';
import { navigation } from './src/modules/navigation';
import { drawing } from './src/modules/drawing';

const server = new WebSocket.Server({
    port: 8080
});

let sockets : WebSocket.WebSocket[] = [];
server.on('connection', function(socket) {
    sockets.push(socket);
    console.log('connect');

    // When you receive a message, send that message to every socket.
    socket.on('message', function(msg : ArrayBuffer) {
        const command = Buffer.from(msg).toString();
        sockets.forEach(s => s.send(command + '\0'));
        console.log('command', command);

        if (command.match(/^mouse_/)) {
            navigation(command, sockets);
        }
        else if (command.match(/^draw_/)) {
            drawing(command);
        }
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
        // sockets = sockets.filter(s => s !== socket);
        console.log('close');
    });
});
