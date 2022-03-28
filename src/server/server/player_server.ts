import { v4 as uuidv4 } from 'uuid';
import * as v from 'validator';

export function createPlayer(id: string, name: string): IRoomPlayer {
    if (!v.default.isUUID(id)) {
        id = uuidv4();
    }
    return {
        name: name,
        id: id
    };
}

export function getPlayer(id: string, name: string): IRoomPlayer {
    if (!v.default.isUUID(id)) {
        throw new Error(`Player id ${id} is not a valid UUID`);
    }
    return {
        name: name,
        id: id
    };
}
