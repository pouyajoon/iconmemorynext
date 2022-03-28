import { getBoardItem } from "./board";

export function flipIcon(
    manager: IRoomManager,
    roomId: string,
    playerId: string,
    pos: IPosition,
    firstFlip?: IBoardFirstItemFlippedEvent)
: IBoardFirstItemFlippedEvent | IBoardSecondItemFlippedEvent {

    const room = manager.rooms.find(r => r.id === roomId);
    if (!room) {
        throw new Error(`Room ${roomId} not found`);
    }
    const player = room.players.find(p => p.id === playerId);
    if (!player) {
        throw new Error(`Player ${playerId} not found`);
    }
    const board = room.board;
    const item = getBoardItem(board, pos);
    console.log("yay")
    console.log(item)
    console.log(item.event)
    if (item.event !== null) {
        throw new Error(`You can't flip an already-flipped item`);
    }
    if (!firstFlip) {
        // first flip
        item.event = firstFlip;
        return {
            type: EVENT_TYPE_FIRST_ITEM_FLIPPED,
            playerId: playerId,
            timestamp: Date.now(),
            position: pos,
        };
    }

    if (firstFlip.playerId !== playerId) {
        throw new Error(`You can't flip an item with a different player`);
    }

    const firstItem = getBoardItem(board, firstFlip.position);
    const secondItem = getBoardItem(board, pos);

    const event = {
        type: EVENT_TYPE_SECOND_ITEM_FLIPPED,
        playerId: playerId,
        timestamp: Date.now(),
        position1: firstFlip.position,
        position2: pos,
        isPair: firstItem == secondItem,
    }

    firstItem.event = event;
    secondItem.event = event;

    return event;
}
