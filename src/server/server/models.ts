
export const EVENT_TYPE_FIRST_ITEM_FLIPPED = 'EVENT_TYPE_FIRST_ITEM_FLIPPED'
export const EVENT_TYPE_SECOND_ITEM_FLIPPED = 'EVENT_TYPE_SECOND_ITEM_FLIPPED'

export interface IBoard {
    size: number;
    items: IBoardItem[];
    close: boolean;
}

export interface IFlipIcon {
    roomId: string,
    currentPlayerId: string,
    itemId: number;
    // firstFlip: IBoardItemFlippedEvent | null;
}


export interface IBoardItem {
    index: number;
    icon: string;
    playerId?: string;
    lastFlipTime?: number;
    discover: boolean;
    // event: IBoardItemFlippedEvent | null;
}

export interface IRoom {
    id: string;
    players: Record<string, IRoomPlayer>;
    board: IBoard;
}

export interface IRoomPlayer {
    id: string;
    name: string;
    score: number;
    color: string;
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
