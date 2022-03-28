import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IBoard, IBoardItem, IFlipIcon, IRoom } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { sortBoardItems } from "./board.items";
import { roomAtom, useRoomId } from "./rooms.recoil";
import { wait } from "./timer";




const itemWidth = 60;
export function Board(props: { board: IBoard }) {
    const { board } = props;
    const { items, size } = board;

    const width = Math.sqrt(size);
    const max = width * 60 + width * 4 + width * 2;
    // console.log('ITEMS', size, width, board, items);
    return <div style={{ display: 'flex', width: max, flexDirection: 'row', flexWrap: 'wrap' }}>
        {sortBoardItems(items).map((item, i) => <BoardItem item={item} key={i} />)}
    </div>
}

function BoardItem(props: { item: IBoardItem }) {
    const roomId = useRoomId();
    const [room, setRoom] = useRecoilState(roomAtom(roomId));

    const currentPlayerId = localStorage?.getItem('playerId');
    if (!roomId || !currentPlayerId) {
        return null;
    }
    const { item } = props;

    const color = room?.players[item.event?.playerId || '0']?.color;
    return <div style={{
        cursor: 'pointer',
        margin: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: itemWidth,
        color,
        fontSize: '3rem',
        fontWeight: 'bold',
        height: itemWidth, border: '1px solid blue'
    }}
        onClick={() => {
            if (!item.event) {
                // const firstFlip = room?.board.items.find(i => i.event?.playerId === currentPlayerId)?.event || null;
                const flip: IFlipIcon = { roomId, itemId: item.index, currentPlayerId: currentPlayerId };
                // if (room) {
                //     const newItems = [...room.board.items];
                //     newItems[item.index] = { ...item, playerId: currentPlayerId };
                //     setRoom({ ...room, board: { ...room.board, items: newItems } });
                // }
                userSocket.emit('/icon/flip', flip)
            }
        }}
    >{item.playerId && item.icon}</div>
}