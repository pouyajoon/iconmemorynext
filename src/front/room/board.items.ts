import { IBoardItem } from "../../server/server/models";

export function sortBoardItems(items: IBoardItem[]) {
    return [...items].sort((a, b) => a.index - b.index);
}