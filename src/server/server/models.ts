const EVENT_TYPE_BOARD_ITEM_FLIPPED = 'BOARD_ITEM_FLIPPED'

interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

interface IBoardItem {
    posX: number;
    posY: number;
    icon: string;
    event?: IBoardItemFlippedEvent;
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

interface IBoardItemFlippedEvent {
    type: string
    playerId: string
    timestamp: number
}
