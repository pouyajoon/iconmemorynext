
import { v } from 'validator';
import { createPlayer, getPlayer } from "./player_server";
import { createRoom, createRoomManager, DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, getRoom, joinRoom } from "./room_server";

function test() {
    const manager = createRoomManager()
    // c
    manager.rooms.length == 0;
    const room = createRoom(manager);
    v.isUUID(room.id)
    room.board.width == DEFAULT_MAP_WIDTH;
    room.board.height == DEFAULT_MAP_HEIGHT;
    room.board.items.length == DEFAULT_MAP_WIDTH * DEFAULT_MAP_HEIGHT;
    room.players.length == 0
    manager.rooms.length = 1;
}
