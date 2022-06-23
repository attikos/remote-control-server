import robot from 'robotjs';

export const drawing = (command: string) => {
    const {x, y} = robot.getMousePos();
    const [action, radius, length]: string[] = command.split(' ');

    console.log('command', command);
    console.log('radius', radius);
    console.log('length', length);


    if (action === 'draw_circle') {
        let newX = x + (+radius * Math.cos(0));
        let newY = y + (+radius * Math.sin(0));
        robot.moveMouse(newX, newY);

        robot.mouseToggle('down');

        for (let i = 0; i <= Math.PI * 2; i += 0.1) {
            newX = x + (+radius * Math.cos(i));
            newY = y + (+radius * Math.sin(i));
            robot.dragMouse(newX, newY);
        }

        robot.mouseToggle('up');
        robot.moveMouse(x, y);
    }

    if (action === 'draw_rectangle') {
        const width = +radius;
        const height = +length;
        let newX = x + width / 2;
        let newY = y - height / 2;

        robot.moveMouse(newX, newY);
        robot.mouseToggle('down');

        newY += height;
        robot.moveMouseSmooth(newX, newY, 10);

        newX -= width;
        robot.moveMouseSmooth(newX, newY, 10);

        newY -= height;
        robot.moveMouseSmooth(newX, newY, 10);

        newX += width;
        robot.moveMouseSmooth(newX, newY, 10);

        robot.mouseToggle('up');
        robot.moveMouse(x, y);

        return;
    }

    if (action === 'draw_square') {
        const width = +radius;
        let newX = x + width / 2;
        let newY = y - width / 2;

        robot.moveMouse(newX, newY);
        robot.mouseToggle('down');

        newY += +width;
        robot.moveMouseSmooth(newX, newY, 10);

        newX -= +width;
        robot.moveMouseSmooth(newX, newY, 10);

        newY -= +width;
        robot.moveMouseSmooth(newX, newY, 10);

        newX += +width;
        robot.moveMouseSmooth(newX, newY, 10);

        robot.mouseToggle('up');
        robot.moveMouse(x, y);

        return;
    }
};
