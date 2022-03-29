import { wait } from "../../front/room/timer";
import { getBoardItem } from "./board";
import { broadcastRoom } from "./broadcast";
import { IBoard, IBoardItem, IBoardItemFlippedEvent, IFlipIcon, IRoom, IRoomManager } from "./models";
import { ISocketData } from "./socket.models";

import { uniq } from 'loadsh';


function isItemSafe(item: IBoardItem) {
    const now = Date.now();
    if (item.lastFlipTime) {
        return (now - item.lastFlipTime) < 1000;
    }
    return true;
}

function checkRoom(room: IRoom, sockets: Map<string, ISocketData>) {
    let updateCount = 0;
    const focus = room.board.items.filter(i => !i.discover && i.playerId)
    focus.map(item => {
        const playerItems = room.board.items.filter(i => i.playerId === item.playerId && !i.discover);
        console.log('check'.red, item, playerItems, playerItems.map(i => i.lastFlipTime && Date.now() - i.lastFlipTime));
        const icons = playerItems.map(i => i.icon);
        const hasPair = icons.length === 2 && uniq(icons).length === 1;
        if (hasPair) {
            for (let i = 0; i < playerItems.length; i += 1) {
                playerItems[i].discover = true;
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
    console.log('check'.blue, updateCount);
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

    console.log('item'.green, item, currentPlayerId);

    // escape already discover
    if (item.discover) {
        return;
    }
    // not current player item
    if (item.playerId && item.playerId !== currentPlayerId) {
        return;
    }

    const userNotDiscoverItems = board.items.filter(i => i.playerId === currentPlayerId && !i.discover);
    console.log('userNotDiscoverItems', userNotDiscoverItems);
    if (userNotDiscoverItems.length > 1) {
        return;
    }

    item.playerId = currentPlayerId;
    item.lastFlipTime = Date.now();
    wait(1200).then(() => checkRoom(room, sockets))
    return room;

    // const otherNotDiscoverItem = board.items.find(i => i.playerId === currentPlayerId && !item.discover && item.index !== i.index);
    // if (!otherNotDiscoverItem) {
    //     item.playerId = currentPlayerId;
    //     item.lastFlipTime = Date.now();
    //     wait(1200).then(() => checkRoom(room, sockets))
    //     return room;
    // } else {
    //     if (otherNotDiscoverItem) {
    //         item.playerId = currentPlayerId;
    //         item.lastFlipTime = Date.now();
    //         wait(1200).then(() => checkRoom(room, sockets))
    //         return room;
    //         // if (otherNotDiscoverItem.icon === item.icon) {
    //         //     console.log('win');
    //         // } else {
    //         //     item.playerId = currentPlayerId;
    //         //     item.lastFlipTime = Date.now();
    //         //     wait(1200).then(() => checkRoom(room, sockets))
    //         //     return room;
    //         // }
    //     }
}

    // // can only have 1 other not discover item
    // if (!otherNotDiscoverItem) {
    //     item.playerId = currentPlayerId;
    //     // wait(500).then(() => checkRoom(room, sockets))
    //     return room;
    // }

    // const otherItemFlippedSameUser = board.items.find(i => i.event?.playerId === currentPlayerId);

    // if (otherItemFlippedSameUser === undefined) {
    //     // first click
    //     item.playerId = currentPlayerId;
    //     // item.flipped = true;
    // }
    // if (otherItemFlippedSameUser?.icon === item.icon) {
    //     console.log('same icon');
    // } else {
    //     console.log('not same icon');
    //     // otherItemFlippedSameUser?.event= null;
    // }

    // // if (item.flipped){
    // //     board.items
    // // }
    // // board.items.

    // if (item.event) {
    //     throw new Error(`You can't flip an already-flipped item`);
    // }

    // if (!firstFlip) {
    //     // first flip
    //     const event = {
    //         type: EVENT_TYPE_FIRST_ITEM_FLIPPED,
    //         playerId: playerId,
    //         timestamp: Date.now(),
    //         index1: index,
    //         index2: undefined,
    //         isPair: false
    //     };
    //     item.event = event;
    //     item.flipped = true;
    //     return event;
    // }

    // if (firstFlip.playerId !== playerId) {
    //     throw new Error(`You can't flip an item with a different player`);
    // }

    // const firstItem = getBoardItem(board, firstFlip.index1);
    // const secondItem = getBoardItem(board, index);
    // const isPair = firstItem.icon == secondItem.icon;

    // const event = {
    //     type: EVENT_TYPE_SECOND_ITEM_FLIPPED,
    //     playerId: playerId,
    //     timestamp: Date.now(),
    //     index1: firstFlip.index1,
    //     index2: index,
    //     isPair: isPair,
    // }
    // if (isPair) {
    //     secondItem.event = event // set event on second item
    //     secondItem.flipped = true;
    // } else {
    //     firstItem.event = null; // clear event on first item
    //     firstItem.flipped = false;
    // }
    // if (board.items.filter(i => i.event === undefined).length == 0) {
    //     // TODO emit victory event
    // }
    // return room;
    // return event;
}


function foundPair(board: IBoard, event: IBoardItemFlippedEvent) {
    event.playerId
}
