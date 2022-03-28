

const DEFAULT_MAP_WIDTH = 3
const DEFAULT_MAP_HEIGHT = 3;

export function createRoomManager(): IRoomManager {
    return { rooms: [] };
}

function createBoard(size: ISize): IBoard {
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
                posX: x,
                posY: y,
                icon: 'unassigned'
            });
        }
    }
    for (let i = 0; i < size.width * size.height / 2; i++) {
        let item = getRandomUnassignedItem(size, items)
        item.icon = i.toString()
        item = getRandomUnassignedItem(size, items)
        item.icon = i.toString()
    }
    return items;
}

function getRandomUnassignedItem(size: ISize, items: IBoardItem[]): IBoardItem {
    while (true) {
        const randpos = Math.random() * items.length / 2
        const res = items[Math.floor(randpos)]
        if (res.icon == 'unassigned') {
            return res
        }
    }
}

export function createRoom(manager: IRoomManager): IRoom {
    const board = createBoard({ width: DEFAULT_MAP_WIDTH, height: DEFAULT_MAP_HEIGHT });
    console.log(board);
    const room = {
        id: Math.random().toFixed(0),
        players: [],
        board: board
    };
    console.log(room);
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
