interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

interface IBoardItem {
    posX: number;
    posY: number;
    icon: string;
}

interface IRoom {
    players: IRoomPlayer[];
    board: IBoard;
}

interface IRoomPlayer {
    name: string;
}

interface IRoomManager {
    rooms: IRoom[];
}

interface ISize {
    width: number;
    height: number;
}

interface IPosition {
    x: number;
    y: number;
}
