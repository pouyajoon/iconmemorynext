import "colors";
import * as v from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { createPlayer, getPlayer } from "./player_server";
import { createRoom, createRoomManager, DEFAULT_MAP_HEIGHT, DEFAULT_MAP_WIDTH, getRoom, joinRoom } from "./room_server";
import { flipIcon } from "./board_server";
import { EVENT_TYPE_FIRST_ITEM_FLIPPED, EVENT_TYPE_SECOND_ITEM_FLIPPED } from "./models";
import { getBoardItem } from "./board";


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

        room.board.items[0].icon = 'unique'

        const first = flipIcon(manager, { roomId: room.id, playerId: player.id, itemId: '0' });
        expect(first.playerId).toBe(player.id)
        expect(first.position1.x).toBe(0)
        expect(first.position1.y).toBe(0)
        expect(first.type).toBe(EVENT_TYPE_FIRST_ITEM_FLIPPED)

        expect(getBoardItem(room.board, first.position1).event).toBe(first)  // event should be set

        const second = flipIcon(manager, { roomId: room.id, playerId: player.id, itemId: '1' }, first);
        expect(second.playerId).toBe(player.id)
        expect(second.isPair).toBe(false)
        expect(second.position1.x).toBe(0)
        expect(second.position1.y).toBe(0)
        expect(second.position2 != undefined).toBe(true)
        if (second.position2 != undefined) {
            expect(second.position2.x).toBe(0)
            expect(second.position2.y).toBe(1)
        }
        expect(second.type).toBe(EVENT_TYPE_SECOND_ITEM_FLIPPED)
        expect(getBoardItem(room.board, first.position1).event).toBe(undefined) // event should be cleared
    });
});
