import { v4 as uuidv4 } from 'uuid';
import * as v from 'validator';
import { IRoomPlayer } from './models';


export function getPlayerNewId() {
    return uuidv4();
}

export function createPlayer(name: string, color?: string): IRoomPlayer {
    // if (id === null || !v.default.isUUID(id)) {
    //     return {
    //         ...player,
    //         id: uuidv4(),
    //     };
    // }
    // return player;
    return { name, color: color || '#FF0000', id: uuidv4(), score: 0 }
}

// export function getPlayer(id: string, name: string): IRoomPlayer {
//     if (!v.default.isUUID(id)) {
//         throw new Error(`Player id ${id} is not a valid UUID`);
//     }
//     return {
//         name: name,
//         id: id,
//         score: 0 // todo get current score
//     };
// }
