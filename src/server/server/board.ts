import { IBoard, IBoardItem } from "./models";

/**
 *
 * @param board
 * @param pos
 * @returns The board item at (x, y)
 */
export function getBoardItem(board: IBoard, index: number): IBoardItem {
    if (index >= board.width * board.height || index < 0) {
        throw new Error(`Out of bounds: idnex (${index}) doesn't exist on this board`);
    }
    return board.items[index];
}
