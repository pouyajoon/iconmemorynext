import "colors";
import * as v from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { createPlayer, getPlayer } from "./player_server";
import { createRoom, createRoomManager, DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, getRoom, joinRoom } from "./room_server";


describe("board", () => {
    test("test create room", async () => {

        const manager = createRoomManager()
        expect(manager.rooms.length).toBe(0);

        let room = createRoom(manager);
        const roomId = room.id;

        expect(v.default.isUUID(room.id)).toBe(true)
        expect(room.board.width).toBe(DEFAULT_MAP_WIDTH);
        expect(room.board.height).toBe(DEFAULT_MAP_HEIGHT);
        expect(room.board.items.length).toBe(DEFAULT_MAP_WIDTH * DEFAULT_MAP_HEIGHT);
        expect(room.players.length).toBe(0)
        manager.rooms.length = 1;

        room = getRoom(manager, roomId)
        expect(room.id).toBe(roomId)

        const playerId = uuidv4();
        const playerName = 'player'
        let player = createPlayer(playerId, playerName);
        expect(player.id).toBe(playerId)
        expect(player.name).toBe('player')

        player = getPlayer(playerId, playerName)
        expect(player.id).toBe(playerId)
        expect(player.name).toBe('player')

        joinRoom(player, room);
        expect(room.players.length).toBe(1);

        expect(true).toBe(true);
    });


    test("test flip icons", async () => {

        const manager = createRoomManager()
        const room = createRoom(manager);
        const playerName = 'player'
        const player = createPlayer(null, playerName);
        joinRoom(player, room);

        // TODO
    });
});
