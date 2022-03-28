
import { v4 as uuidv4 } from 'uuid';
import { IBoard, IBoardItem, IRoom, IRoomManager, IRoomPlayer, ISize } from './models';

export const DEFAULT_MAP_WIDTH = 4;

export function createRoomManager(): IRoomManager {
    return { rooms: [] };
}

function createBoard(width: number): IBoard {
    const size = width * width;
    return {
        size,
        items: createBoardItems(size)
    }
}



function createBoardItems(size: number): IBoardItem[] {
    console.log(size);
    const items: IBoardItem[] = [];
    for (let x = 0; x < size; x++) {
        items.push({
            index: x,
            event: null,
            discover: false,
            icon: 'unassigned'
        });
    }
    for (let i = 0; i < size / 2; i++) {
        let item = getRandomUnassignedItem(items)
        item.icon = i.toString()
        item = getRandomUnassignedItem(items)
        item.icon = i.toString()
    }
    return items;
}

function getRandomUnassignedItem(items: IBoardItem[]): IBoardItem {
    const freeItems = items.filter(item => item.icon === 'unassigned');
    const randpos = Math.random() * freeItems.length;
    const res = freeItems[Math.floor(randpos)]
    return res
}

export function createRoom(manager: IRoomManager): IRoom {
    const board = createBoard(DEFAULT_MAP_WIDTH);
    const room = {
        id: uuidv4(),
        players: {},
        board: board
    };
    addRoom(manager, room)
    return room;
}

export function joinRoom(manager: IRoomManager, player: IRoomPlayer, roomId: string) {
    const room = getRoom(manager, roomId)
    room.players[player.id] = player;
    console.log(room.players, player);
    return room;
}

function addRoom(manager: IRoomManager, room: IRoom): void {
    manager.rooms.push(room);
}

export function getRoom(manager: IRoomManager, roomId: string): IRoom {
    for (let room of manager.rooms) {
        if (room.id == roomId) {
            return room;
        }
    }
    throw new Error(`Room with id ${roomId} not found`);
}
