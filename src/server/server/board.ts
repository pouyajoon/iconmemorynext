
/**
 *
 * @param board
 * @param pos
 * @returns The board item at (x, y)
 */
export  function getBoardItem(board: IBoard, pos: IPosition): IBoardItem {
    if (pos.x >= board.width || pos.y >= board.height || pos.x < 0 || pos.y < 0) {
        throw new Error(`Out of bounds: position (${pos.x}, ${pos.y}) doesn't exist on this board`);
    }
    return board.items[pos.y * board.width + pos.x];
}
