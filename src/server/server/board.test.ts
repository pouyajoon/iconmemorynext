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
        expect(Object.keys(room.players).length).toBe(0)
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
        expect(Object.keys(room.players).length).toBe(1)

        expect(true).toBe(true);
    });


    test("test flip icons not pair", async () => {

        const manager = createRoomManager()
        const room = createRoom(manager);
        const playerName = 'player'
        const player = createPlayer(null, playerName);
        joinRoom(player, room);

        room.board.items[0].icon = 'unique'

        const first = flipIcon(manager, room.id, player.id, 0);
        expect(first.playerId).toBe(player.id)
        expect(first.index1).toBe(0)
        expect(first.type).toBe(EVENT_TYPE_FIRST_ITEM_FLIPPED)

        expect(getBoardItem(room.board, first.index1).event).toBe(first)  // event should be set

        const second = flipIcon(manager, room.id, player.id, 1, first);
        expect(second.type).toBe(EVENT_TYPE_SECOND_ITEM_FLIPPED)
        expect(second.playerId).toBe(player.id)
        expect(second.index1).toBe(0)
        expect(second.index2 != undefined).toBe(true)
        if (second.index2 != undefined) {
            expect(second.index2).toBe(1)
            expect(getBoardItem(room.board, second.index1).event).toBe(undefined) // event should be cleared
            expect(getBoardItem(room.board, second.index2).event).toBe(undefined)
        }
        expect(second.isPair).toBe(false)
    });

    test("test flip icons pair", async () => {

        const manager = createRoomManager()
        const room = createRoom(manager);
        const playerName = 'player'
        const player = createPlayer(null, playerName);
        joinRoom(player, room);

        room.board.items[0].icon = 'unique'
        room.board.items[1].icon = 'unique'

        const first = flipIcon(manager, room.id, player.id, 0);
        const second = flipIcon(manager, room.id, player.id, 1, first);
        if (second.index2 != undefined) {
            expect(second.index2).toBe(1)
            expect(getBoardItem(room.board, second.index1).event).toBe(first)
            expect(getBoardItem(room.board, second.index2).event).toBe(second)
        }

        expect(second.isPair).toBe(true)
    });
});
