export const EVENT_TYPE_FIRST_ITEM_FLIPPED = 'EVENT_TYPE_FIRST_ITEM_FLIPPED'
export const EVENT_TYPE_SECOND_ITEM_FLIPPED = 'EVENT_TYPE_SECOND_ITEM_FLIPPED'

export interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

export interface IBoardItem {
    index: number;
    position: IPosition;
    icon: string;
    event?: IBoardItemFlippedEvent;
}

export interface IRoom {
    id: string;
    players: IRoomPlayer[];
    board: IBoard;
}

export interface IRoomPlayer {
    id: string;
    name: string;
}

export interface IRoomManager {
    rooms: IRoom[];
}

export interface ISize {
    width: number;
    height: number;
}

export interface IPosition {
    x: number;
    y: number;
}

export interface IBoardItemFlippedEvent {
    type: string
    playerId: string
    timestamp: number
    position1: IPosition
    position2?: IPosition
    isPair: boolean;
}
