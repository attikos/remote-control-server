import robot from 'robotjs';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const focusWindow = async (x: number, y: number): Promise<void> => {
    robot.moveMouse(x, y);
    await delay(200);

    robot.mouseToggle('down');
    robot.mouseToggle('up');
    await delay(100);

    robot.mouseToggle('down');
    robot.mouseToggle('up');
    await delay(100);
}

export const drawing = (command: string) => {
    return new Promise(async (resolve) => {
        const {x, y} = robot.getMousePos();
        const [action, radius, length]: string[] = command.split(' ');

        if (action === 'draw_circle') {
            let newX = x + (+radius * Math.cos(0));
            let newY = y + (+radius * Math.sin(0));

            await focusWindow(newX, newY);

            robot.mouseToggle('down');
            for (let i = 0; i <= Math.PI * 2; i += 0.0785) {
                newX = x + (+radius * Math.cos(i));
                newY = y + (+radius * Math.sin(i));
                robot.dragMouse(newX, newY);
            }
            robot.mouseToggle('up');
            robot.moveMouse(x, y);

            resolve(true);
        }

        if (action === 'draw_rectangle') {
            const width = +radius;
            const height = +length;
            let newX = x + width / 2;
            let newY = y - height / 2;

            await focusWindow(newX, newY);

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
            resolve(true);
        }

        if (action === 'draw_square') {
            const width = +radius;
            let newX = x + width / 2;
            let newY = y - width / 2;

            await focusWindow(newX, newY);

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

            resolve(true);
        }
    });
};
