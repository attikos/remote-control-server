import { httpServer } from './src/http_server/index';
import WebSocket from 'ws';
import { navigation } from './src/modules/navigation';
import { drawing } from './src/modules/drawing';
import { printScreen } from './src/modules/printScreen';

const WS_PORT = 8080;
const HTTP_PORT = 3000;

const server = new WebSocket.Server({
    port: WS_PORT
});

console.log(`Start static http server on the http://localhost:${HTTP_PORT} port!`);
console.log(`Start websocket server on the http://localhost:${WS_PORT} port!`);
httpServer.listen(HTTP_PORT);

let sockets : WebSocket.WebSocket[] = [];
server.on('connection', function(socket) {
    sockets.push(socket);
    console.log('connect');

    // When you receive a message, send that message to every socket.
    socket.on('message', async function(msg : ArrayBuffer) {
        const command = Buffer.from(msg).toString();
        sockets.forEach(s => s.send(command + '\0'));
        console.log(command);

        try {
            if (command.match(/^mouse_/)) {
                const mgs = await navigation(command, sockets);
                console.log(mgs);
            }
            else if (command.match(/^draw_/)) {
                const mgs = await drawing(command);
                console.log(mgs);
            }
            else if (command.match(/^prnt_scrn$/)) {
                const mgs = await printScreen(sockets);
                console.log(mgs);
            }
        } catch (error) {
            console.log(error);
        }
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
        console.log('close');
    });
});
