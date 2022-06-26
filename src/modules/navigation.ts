import robot from 'robotjs';

export const navigation = async (command: string, write: (s: string) => void): Promise<string|void> => {
    const {x, y} = robot.getMousePos();
    const [action, value]: string[] = command.split(' ');

    let newX: number = x;
    let newY: number = y;

    if (action === 'mouse_position') {
        write(`mouse_position ${x},${y}\0`);
        return `${action} success!`;
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

    return `${action} success!`;
};
