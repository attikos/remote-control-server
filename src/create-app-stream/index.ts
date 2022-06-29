import internalStream from 'stream'
import { navigation } from '../modules/navigation';
import { drawing } from '../modules/drawing';
import { printScreen } from '../modules/printScreen';

export const createAppStream = (duplex: internalStream.Duplex) => {
    const write = (m: string) => duplex.write(m);

    duplex.on('error', () => duplex.write('Something went wrong\0') );
    duplex.on('close', () => write('Connection closed'));

    duplex.on('data', async (chunk) => {
        const command = Buffer.from(chunk).toString();

        console.log(command);

        let msg : string = '';

        try {
            if (command.match(/^mouse_/)) {
                msg = await navigation(command, write);
            }
            else if (command.match(/^draw_/)) {
                msg = await drawing(command);
                write(`${command}\0`)
            }
            else if (command.match(/^prnt_scrn$/)) {
                msg = await printScreen(write);
            }

            console.log(msg);
        } catch (error) {
            console.log(error);
        }
    });
}
