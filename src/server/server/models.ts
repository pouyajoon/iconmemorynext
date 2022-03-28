export const EVENT_TYPE_FIRST_ITEM_FLIPPED = 'EVENT_TYPE_FIRST_ITEM_FLIPPED'
export const EVENT_TYPE_SECOND_ITEM_FLIPPED = 'EVENT_TYPE_SECOND_ITEM_FLIPPED'

export interface IBoard {
    width: number;
    height: number;
    items: IBoardItem[];
}

export interface IBoardItem {
    index: number;
    icon: string;
    event?: IBoardItemFlippedEvent;
}

export interface IRoom {
    id: string;
    players: Map<string, IRoomPlayer>;
    board: IBoard;
}

export interface IRoomPlayer {
    id: string;
    name: string;
    score: number;
}

export interface IRoomManager {
    rooms: IRoom[];
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBoardItemFlippedEvent {
    type: string
    playerId: string
    timestamp: number
    index1: number
    index2?: number
    isPair: boolean;
}
