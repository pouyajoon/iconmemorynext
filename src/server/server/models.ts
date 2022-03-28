const EVENT_TYPE_FIRST_ITEM_FLIPPED = 'EVENT_TYPE_FIRST_ITEM_FLIPPED'
const EVENT_TYPE_SECOND_ITEM_FLIPPED = 'EVENT_TYPE_SECOND_ITEM_FLIPPED'

interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

interface IBoardItem {
    index: number;
    position: IPosition;
    icon: string;
    event?: IBoardFirstItemFlippedEvent | IBoardSecondItemFlippedEvent | null;
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
    type: string
    playerId: string
    timestamp: number
    position: IPosition
}

interface IBoardSecondItemFlippedEvent {
    type: string
    playerId: string
    timestamp: number
    position1: IPosition
    position2: IPosition
    isPair: boolean;
}

