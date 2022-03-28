function flipIcon(
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
    if (item.event) {
        throw new Error(`You can't flip an already-flipped item`);
    }
    if (!firstFlip) {
        // first flip
        return {
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
