function createBoardItemFlippedEvent(playerId: string, timestamp: number) {
    return {
        type: EVENT_TYPE_BOARD_ITEM_FLIPPED,
        playerId: playerId,
        timestamp: timestamp
    };
}

function flipIcon(manager: IRoomManager, roomId: string, playerId: string, pos: IPosition) {
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
    const event = createBoardItemFlippedEvent(playerId, Date.now());
    item.event = event;
}
