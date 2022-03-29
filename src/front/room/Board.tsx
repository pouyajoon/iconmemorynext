import React, { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IBoard, IBoardItem, IFlipIcon, IRoom } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { roomAtom, useRoomId } from "./rooms.recoil";
import { svgIcons } from "./svgIcons";

const itemWidth = 100;
const itemMargin = 5;
const itemBorderWidth = 2;
const itemBorderRadius = 4;

export function Board(props: { board: IBoard }) {
    const { board } = props;
    const { items, size } = board;
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const dom = ref.current?.getBoundingClientRect();
        console.log('DOM', dom);
    }, [ref])

    const width = Math.sqrt(size);
    const max = width * itemWidth + width * itemBorderRadius + width * 2 * itemBorderWidth + itemMargin * (width + 1) + 10;
    // console.log('ITEMS', size, width, board, items);
    return <div ref={ref} style={{ display: 'flex', width: max, flexDirection: 'row', flexWrap: 'wrap' }}>
        {items.map((item, i) => <BoardItem item={item} key={i} />)}
    </div>
}

function getSvgIcon(icon: string): string {
    // for now, the "icon" input param is always an int
    return svgIcons[parseInt(icon) % svgIcons.length];
}

function createMarkup(svgIcon: string) {
    return { __html: svgIcon };
}

function BoardItem(props: { item: IBoardItem }) {
    const roomId = useRoomId();
    const [room, setRoom] = useRecoilState(roomAtom(roomId));

    const currentPlayerId = localStorage?.getItem('player.id');
    if (!roomId || !currentPlayerId) {
        return null;
    }
    const { item } = props;

    const color = room?.players[item.playerId || '0']?.color;
    const flipped = item.playerId ? 'flip-card-flipped' : ''
    const classes = `flip-card ${flipped}`
    const svgIcon = getSvgIcon(item.icon)
    return <div style={{
        width: itemWidth,
        height: itemWidth * 1.3,
        margin: itemMargin,
        color: color,
        borderRadius: itemBorderRadius,
        borderWidth: itemBorderWidth,
        borderColor: item.playerId ? color : undefined,
        backgroundColor: item.discover ? color : undefined
    }}
        data-index={item.index}
        className={classes}
        onClick={() => {
            const flip: IFlipIcon = { roomId, itemId: item.index, currentPlayerId: currentPlayerId };
            console.log('EMIT', flip);
            userSocket.emit('/icon/flip', flip)
        }}>
        {!item.discover && <div className="flip-card-inner">
            <div className="flip-card-front">
                {/* <span style={{ fontSize: '3rem' }}>{item.icon}</span> */}
            </div>
            <div className="flip-card-back"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                dangerouslySetInnerHTML={createMarkup(svgIcon)}></div>
        </div>}
    </div>
}
