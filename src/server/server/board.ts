import { IBoard, IBoardItem, IPosition } from "./models";

/**
 *
 * @param board
 * @param pos
 * @returns The board item at (x, y)
 */
export function getBoardItem(board: IBoard, index: string): IBoardItem {
    return board.items[index];
    // if (pos.x >= board.width || pos.y >= board.height || pos.x < 0 || pos.y < 0) {
    //     throw new Error(`Out of bounds: position (${pos.x}, ${pos.y}) doesn't exist on this board`);
    // }
    // return board.items[pos.y * board.width + pos.x];
}
