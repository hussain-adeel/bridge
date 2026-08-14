import { roomExists } from "../game/state.js";
import { ROOM_CODE_CHARACTERS, ROOM_CODE_LENGTH } from "../game/constants.js";

export function generateRoomCode() {
    let code;

    do {
        code = "";
        for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
            code += ROOM_CODE_CHARACTERS.charAt(Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length));
        }
    }
    while (roomExists(code))

    return code;
}
