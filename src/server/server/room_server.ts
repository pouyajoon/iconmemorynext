const DEFAULT_MAP_WIDTH = 3
const DEFAULT_MAP_HEIGHT = 3;

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

function createRoom(manager: IRoomManager, player: IRoomPlayer): IRoom {
    const board = createBoard({ width: DEFAULT_MAP_WIDTH, height: DEFAULT_MAP_HEIGHT});
    const room = {
        players: [player],
        board: board
    };
    joinRoom(player, room)
    addRoom(manager, room)
    return room;
}

function joinRoom(player: IRoomPlayer, room: IRoom): void {
    room.players.push(player);
}

function addRoom(manager: IRoomManager, room: IRoom): void {
    manager.rooms.push(room);
}

