
import { v4 as uuidv4 } from 'uuid';
import { IBoard, IBoardItem, IRoom, IRoomManager, IRoomPlayer, ISize } from './models';
import { generatePlayerColor, generatePlayerName } from './player';

export const DEFAULT_MAP_WIDTH = 6;

export function createRoomManager(): IRoomManager {
    return { rooms: [] };
}

export function createBoard(width: number): IBoard {
    const size = width * width;
    return {
        size,
        items: createBoardItems(size),
        close: false
    }
}

function createBoardItems(size: number): IBoardItem[] {
    const items: IBoardItem[] = [];
    for (let x = 0; x < size; x++) {
        items.push({
            index: x,
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

export function addPlayerToRoom(room: IRoom, playerId: string, color: string | null, name: string | null) {

    if (!name ||
        Object.values(room.players).filter(p => p.name === name && p.id != playerId).length > 0) {
        name = generatePlayerName(room, playerId)
    }

    if (!color) {
        color = generatePlayerColor(room, playerId);
    }

    let score = 0
    if (room.players[playerId] !== undefined) {
        score = room.players[playerId].score
    }

    const player = {
        id: playerId,
        name: name,
        color: color,
        score: score
    }

    room.players[player.id] = player;
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
