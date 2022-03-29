
import { v4 as uuidv4 } from 'uuid';

export function getOrGeneratePlayerId(): string {
    const lsId = localStorage?.getItem("playerId");
    if (lsId) {
        return lsId;
    }

    const newId = uuidv4()
    localStorage?.setItem("playerId", newId);
    return newId
}
