interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

interface IBoardItem {
    index: number;
    posX: number;
    posY: number;
    icon: string;
    event?: IBoardFirstItemFlippedEvent | IBoardSecondItemFlippedEvent;
}

interface IRoom {
    id: string;
    players: IRoomPlayer[];
    board: IBoard;
}

interface IRoomPlayer {
    id: string;
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

interface IBoardFirstItemFlippedEvent {
    playerId: string
    timestamp: number
    position: IPosition
}

interface IBoardSecondItemFlippedEvent {
    playerId: string
    timestamp: number
    position1: IPosition
    position2: IPosition
    isPair: boolean;
}

