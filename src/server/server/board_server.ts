import { wait } from "../../front/room/timer";
import { getBoardItem } from "./board";
import { broadcastRoom } from "./broadcast";
import { EVENT_TYPE_FIRST_ITEM_FLIPPED, EVENT_TYPE_SECOND_ITEM_FLIPPED, IBoard, IBoardItemFlippedEvent, IFlipIcon, IRoom, IRoomManager } from "./models";
import { ISocketData } from "./socket.models";



function checkRoom(room: IRoom, sockets: Map<string, ISocketData>) {
    const players = Object.values(room.players);
    const hasUpdates = players.filter(player => {
        const playerItemsNotDiscover = room.board.items.filter(i => i.playerId === player.id && !i.discover);
        // const sameIconsNotDiscover = playerItemsNotDiscover.filter(i => i.icon)
        if (playerItemsNotDiscover.length === 2) {
            playerItemsNotDiscover.map(item => {
                room.board.items[item.index].discover = true;
            })
            return true;
        }
        // if (playerItemsNotDiscover.length === 2){
        //     playerItemsNotDiscover.map(item =>{
        //         room.board.items[item.index].discover = true;
        //     })
        //     return room;
        // }
    })
    if (hasUpdates.length > 0) {
        broadcastRoom(sockets, room);
    }
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

    item.playerId = currentPlayerId;
    wait(500).then(() => checkRoom(room, sockets))
    return room;

    // const otherNotDiscoverItem = board.items.find(i => i.playerId === currentPlayerId && !item.discover);
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
