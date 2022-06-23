import robot from 'robotjs';
import { WebSocket } from "ws";
import Jimp from 'jimp';

export const printScreen = async (sockets: WebSocket[]) => {
    const mousePos = robot.getMousePos();
    var size = 200;

    await new Promise(async (resolve, reject) => {
        try {
            var picture = robot.screen.capture(mousePos.x - size/2, mousePos.y - size/2, size, size);
            const image = new Jimp(picture.width, picture.height, async function(_err, img) {
                img.bitmap.data = picture.image;
            });

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
