import robot from 'robotjs';
import { WebSocket } from "ws";
import Jimp from 'jimp';

const screenCapture = (x = 0, y = 0, w: number, h: number): Promise<Jimp> => {
    return new Promise((resolve, reject) => {
        try {
            const robotScreenPic = robot.screen.capture(x, y, w, h)
            const { width, height } = robotScreenPic
            const image = new Jimp(width, height)
            let pos = 0
            image.scan(x, y, width, height, (_x1, _y1, idx) => {
                image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++)
                image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++)
                image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++)
                pos++
                image.bitmap.data[idx + 3] = 255
            })
            resolve(image)
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}

export const printScreen = async (sockets: WebSocket[]) => {
    const mousePos = robot.getMousePos();
    var size = 200;

    await new Promise(async (resolve, reject) => {
        try {
            const image = await screenCapture(mousePos.x - size/2, mousePos.y - size/2, size, size)

            const base64 = await image.getBase64Async(Jimp.MIME_PNG);
            const header = /^data:image\/png;base64,/;

            sockets.forEach(s => s.send(`prnt_scrn ${base64.replace(header, '')}\0`));

            resolve(true);

        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
};
