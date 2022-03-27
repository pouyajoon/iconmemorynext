
/**
 *
 * @param board
 * @param posX
 * @param posY
 * @returns The board item at (x, y)
 */
function getItem(board: IBoard, posX: number, posY: number): IBoardItem {
    if (posX >= board.width || posY >= board.height || posX < 0 || posY < 0) {
        throw new Error(`Out of bounds: position (${posX}, ${posY}) doesn't exist on this board`);
    }
    return board.items[posY * board.width + posX];
}