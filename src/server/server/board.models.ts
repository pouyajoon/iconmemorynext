interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
    getItem(x: number, y: number): IBoardItem;
}

interface IBoardItem {
    posX: number;
    posY: number;
    icon: string;
}
