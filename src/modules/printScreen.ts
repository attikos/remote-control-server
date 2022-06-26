import robot from 'robotjs';
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

export const printScreen = (write: (s: string) => void): Promise<string>  => {
    const mousePos = robot.getMousePos();
    var size = 200;

    return new Promise(async (resolve, reject) => {
        try {
            const cX = (mousePos.x - size/2) < 0 ? 0 : mousePos.x - size/2;
            const cY = (mousePos.y - size/2) < 0 ? 0 : mousePos.y - size/2;
            const image = await screenCapture(cX, cY, size, size)

            const base64 = await image.getBase64Async(Jimp.MIME_PNG);
            const header = /^data:image\/png;base64,/;

            write(`prnt_scrn ${base64.replace(header, '')}\0`);

            resolve('prnt_scrn success!');

        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
};
