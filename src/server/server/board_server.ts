import { wait } from "../../front/room/timer";
import { getBoardItem } from "./board";
import { broadcastRoom } from "./broadcast";
import { IBoard, IBoardItem, IBoardItemFlippedEvent, IFlipIcon, IRoom, IRoomManager, IRoomPlayer } from "./models";
import { ISocketData } from "./socket.models";

import { uniq } from 'loadsh';
import { createBoard } from "./room";


function isItemSafe(item: IBoardItem) {
    const now = Date.now();
    if (item.lastFlipTime) {
        return (now - item.lastFlipTime) < 1000;
    }
    return true;
}

function resetBoard(room: IRoom) {
    const board = createBoard(Math.sqrt(room.board.size));
    room.board = board;
    const players: Record<string, IRoomPlayer> = Object.values(room.players).reduce((acc, v) => {
        acc[v.id] = v;
        return acc;
    }, {});
    room.players = players;
}

function gameEndAndRestart(room: IRoom, sockets: Map<string, ISocketData>, ms?: number) {
    setTimeout(() => {
        resetBoard(room);
        broadcastRoom(sockets, room);
    }, ms || 5000);
}

function checkRoom(room: IRoom, sockets: Map<string, ISocketData>) {
    let updateCount = 0;
    const focus = room.board.items.filter(i => !i.discover && i.playerId)
    focus.map(item => {
        const playerItems = room.board.items.filter(i => i.playerId === item.playerId && !i.discover);
        // console.log('check'.red, item, playerItems, playerItems.map(i => i.lastFlipTime && Date.now() - i.lastFlipTime));
        const icons = playerItems.map(i => i.icon);
        const hasPair = icons.length === 2 && uniq(icons).length === 1;
        if (hasPair) {
            for (let i = 0; i < playerItems.length; i += 1) {
                playerItems[i].discover = true;
                room.players[playerItems[i].playerId || '?'].score += 1;
                updateCount += 1;
            }
        } else {
            if (playerItems.length == 2) {
                const latest = playerItems.sort((i1, i2) => (i2.lastFlipTime || 0) - (i1.lastFlipTime || 0))
                if (latest[0] && !isItemSafe(latest[0])) {
                    for (let i = 0; i < playerItems.length; i += 1) {
                        playerItems[i].playerId = undefined;
                        updateCount += 1;
                    }
                }
            }
        }
    })

    if (room.board.items.filter(i => i.discover === true || i.playerId !== undefined).length === room.board.items.length) {
        gameEndAndRestart(room, sockets);
        updateCount += 1;
    }


    if (room.board.items.filter(i => i.discover !== true).length === 0) {
        console.log('board close');
        room.board.close = true;

        gameEndAndRestart(room, sockets);
        updateCount += 1;
    }
    // console.log('check'.blue, updateCount);
    if (updateCount > 0) {
        broadcastRoom(sockets, room);
    }

    // const players = Object.values(room.players);
    // const hasUpdates = players.filter(player => {
    //     const playerItemsNotDiscover = room.board.items.filter(i => i.playerId === player.id && !i.discover);
    //     // const sameIconsNotDiscover = playerItemsNotDiscover.filter(i => i.icon)
    //     if (playerItemsNotDiscover.length === 2) {
    //         playerItemsNotDiscover.map(item => {
    //             room.board.items[item.index].discover = true;
    //         })
    //         return true;
    //     }
    //     // if (playerItemsNotDiscover.length === 2){
    //     //     playerItemsNotDiscover.map(item =>{
    //     //         room.board.items[item.index].discover = true;
    //     //     })
    //     //     return room;
    //     // }
    // })
    // if (hasUpdates.length > 0) {
    //     broadcastRoom(sockets, room);
    // }
}

export function flipIcon(manager: IRoomManager, sockets: Map<string, ISocketData>, flipIcon: IFlipIcon) {
    const { roomId, currentPlayerId, itemId: index } = flipIcon;

    const room = manager.rooms.find(r => r.id === roomId);
    if (!room) {
        throw new Error(`Room ${roomId} not found`);
    }
    if (room.players[currentPlayerId] === undefined) {
        throw new Error(`Player ${currentPlayerId} not found`);
    }
    const board = room.board;
    const item = getBoardItem(board, index);

    // escape already discover
    if (item.discover) {
        return;
    }
    // not current player item
    if (item.playerId && item.playerId !== currentPlayerId) {
        return;
    }

    const userNotDiscoverItems = board.items.filter(i => i.playerId === currentPlayerId && !i.discover);
    if (userNotDiscoverItems.length > 1) {
        return;
    }

    item.playerId = currentPlayerId;
    item.lastFlipTime = Date.now();
    wait(1200).then(() => checkRoom(room, sockets))
    return room;

}

// function foundPair(board: IBoard, event: IBoardItemFlippedEvent) {
//     event.playerId
// }
