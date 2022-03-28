import { getBoardItem } from "./board";
import { EVENT_TYPE_FIRST_ITEM_FLIPPED, EVENT_TYPE_SECOND_ITEM_FLIPPED, IBoardItemFlippedEvent, IFlipIcon, IRoomManager } from "./models";


export function flipIcon(
    manager: IRoomManager,
    flipIcon: IFlipIcon)
    : IBoardItemFlippedEvent {
    const { roomId, playerId, itemId, firstFlip } = flipIcon;

    const room = manager.rooms.find(r => r.id === roomId);
    if (!room) {
        throw new Error(`Room ${roomId} not found`);
    }
    const player = room.players.find(p => p.id === playerId);
    if (!player) {
        throw new Error(`Player ${playerId} not found`);
    }
    const board = room.board;
    const item = getBoardItem(board, itemId);
    if (item.event) {
        throw new Error(`You can't flip an already-flipped item`);
    }

    if (!firstFlip) {
        // first flip
        const event = {
            type: EVENT_TYPE_FIRST_ITEM_FLIPPED,
            playerId: playerId,
            timestamp: Date.now(),
            position1: pos,
            position2: undefined,
            isPair: false
        };
        item.event = event;
        return event;
    }

    if (firstFlip.playerId !== playerId) {
        throw new Error(`You can't flip an item with a different player`);
    }

    const firstItem = getBoardItem(board, firstFlip.position1);
    const secondItem = getBoardItem(board, pos);

    const event = {
        type: EVENT_TYPE_SECOND_ITEM_FLIPPED,
        playerId: playerId,
        timestamp: Date.now(),
        position1: firstFlip.position1,
        position2: pos,
        isPair: firstItem == secondItem,
    }

    firstItem.event = undefined; // clear event

    return event;
}
