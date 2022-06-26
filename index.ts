import { httpServer } from './src/http_server/index';
import WebSocket, { createWebSocketStream } from 'ws';
import { createAppStream } from './src/create-app-stream';

const WS_PORT = 8080;
const HTTP_PORT = 3000;

httpServer.listen(HTTP_PORT);
console.log(`Start static http server on the http://localhost:${HTTP_PORT} port!`);

const server = new WebSocket.Server({
    port: WS_PORT
});
console.log(`Start websocket server on the ws://localhost:${WS_PORT} port!`);

server.on('connection', function(socket) {
    console.log('connect');

    const duplex = createWebSocketStream(socket, { encoding: 'utf8', decodeStrings: false, });

    createAppStream(duplex);
});
