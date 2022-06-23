import WebSocket from 'ws';
import robot from 'robotjs';

export const navigation = (command: string, sockets: WebSocket.WebSocket[]) => {
    const {x, y} = robot.getMousePos();
    const [action, value]: string[] = command.split(' ');

    let newX: number = x;
    let newY: number = y;

    if (action === 'mouse_position') {
        return sockets.forEach(s => s.send(`mouse_position ${x},${y}`));
    }

    if (action === 'mouse_up') {
        newY = y - +value
    }

    if (action === 'mouse_down') {
        newY = y + +value
    }

    if (action === 'mouse_left') {
        newX = x - +value
    }

    if (action === 'mouse_right') {
        newX = x + +value
    }

    robot.moveMouse(newX, newY);
};
