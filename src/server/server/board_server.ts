import { getBoardItem } from "./board";
import { EVENT_TYPE_FIRST_ITEM_FLIPPED, EVENT_TYPE_SECOND_ITEM_FLIPPED, IBoardItemFlippedEvent, IRoomManager } from "./models";

export function flipIcon(
    manager: IRoomManager,
    roomId: string,
    playerId: string,
    index: number,
    firstFlip?: IBoardItemFlippedEvent)
: IBoardItemFlippedEvent {

    const room = manager.rooms.find(r => r.id === roomId);
    if (!room) {
        throw new Error(`Room ${roomId} not found`);
    }
    const player = room.players.find(p => p.id === playerId);
    if (!player) {
        throw new Error(`Player ${playerId} not found`);
    }
    const board = room.board;
    const item = getBoardItem(board, index);
    if (item.event) {
        throw new Error(`You can't flip an already-flipped item`);
    }

    if (!firstFlip) {
        // first flip
        const event = {
            type: EVENT_TYPE_FIRST_ITEM_FLIPPED,
            playerId: playerId,
            timestamp: Date.now(),
            index1: index,
            index2: undefined,
            isPair: false
        };
        item.event = event;
        return event;
    }

    if (firstFlip.playerId !== playerId) {
        throw new Error(`You can't flip an item with a different player`);
    }

    const firstItem = getBoardItem(board, firstFlip.index1);
    const secondItem = getBoardItem(board, index);
    const isPair = firstItem.icon == secondItem.icon;

    const event = {
        type: EVENT_TYPE_SECOND_ITEM_FLIPPED,
        playerId: playerId,
        timestamp: Date.now(),
        index1: firstFlip.index1,
        index2: index,
        isPair: isPair,
    }
    if (isPair) {
        secondItem.event = event // set event on second item
    } else {
        firstItem.event = undefined; // clear event on first item
    }
    return event;
}
