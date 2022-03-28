
import { v4 as uuidv4 } from 'uuid';
import { IBoard, IBoardItem, IRoom, IRoomManager, IRoomPlayer, ISize } from './models';

export const DEFAULT_MAP_WIDTH = 3
export const DEFAULT_MAP_HEIGHT = 4;

export function createRoomManager(): IRoomManager {
    return { rooms: [] };
}

function createBoard(size: ISize): IBoard {
    if ((size.width * size.height) % 2 == 1) {
        throw Error(`Invalid size: board ${size.width},${size.height} must be a an even number of cells`);
    }
    return {
        width: size.width,
        height: size.height,
        items: createBoardItems(size)
    }
}

function createBoardItems(size: ISize): IBoardItem[] {
    const items: IBoardItem[] = [];
    for (let y = 0; y < size.height; y++) {
        for (let x = 0; x < size.width; x++) {
            items.push({
                index: x * size.width + y,
                icon: 'unassigned',
                event: undefined
            });
        }
    }
    for (let i = 0; i < size.width * size.height / 2; i++) {
        let item = getRandomUnassignedItem(items)
        item.icon = i.toString()
        item = getRandomUnassignedItem(items)
        item.icon = i.toString()
    }
    return items;
}

function getRandomUnassignedItem(items: IBoardItem[]): IBoardItem{
    const freeItems = items.filter(item => item.icon === 'unassigned');
    const randpos = Math.random() * freeItems.length;
    const res = freeItems[Math.floor(randpos)]
    return res
}

export function createRoom(manager: IRoomManager): IRoom {
    const board = createBoard({ width: DEFAULT_MAP_WIDTH, height: DEFAULT_MAP_HEIGHT });
    const room = {
        id: uuidv4(),
        players: [],
        board: board
    };
    addRoom(manager, room)
    return room;
}

export function joinRoom(player: IRoomPlayer, room: IRoom): void {
    room.players.push(player);
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
