import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IBoard, IBoardItem, IFlipIcon, IRoom } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { roomAtom, useRoomId } from "./rooms.recoil";
import { svgIcons } from "./svgIcons";
import ReactCardFlip from 'react-card-flip';
import { useHotkeys } from "react-hotkeys-hook";


// const itemWidth = 100;
// const itemMargin = 5;
// const itemBorderWidth = 2;
// const itemBorderRadius = 4;

const itemCard = {
    width: 100, height: 100,
    borderRadius: 4,
    borderWidth: 6,
    margin: 4
}
// const itemCardMargin = 4;

export function Board(props: { board: IBoard }) {
    const { board } = props;
    const { items, size } = board;
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const dom = ref.current?.getBoundingClientRect();
        console.log('DOM', dom);
    }, [ref])

    const width = Math.sqrt(size);
    const max = width * itemCard.width + width * itemCard.borderRadius + width * 2 * itemCard.borderWidth + itemCard.margin * (width + 1) + 10;
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
    const [cheat, setCheat] = useState(false);

    useHotkeys('i+m', (e) => {
        setCheat(value => !value);
    }, [])

    const currentPlayerId = localStorage?.getItem('player.id');
    if (!roomId || !currentPlayerId) {
        return null;
    }
    const { item } = props;

    const color = room?.players[item.playerId || '0']?.color;
    const svgIcon = getSvgIcon(item.icon);

    const { discover } = item;
    return <ReactCardFlip
        containerStyle={{
            ...itemCard,
            borderStyle: 'solid',
            borderColor: discover ? 'transparent' : item.playerId ? color : '#efefef',
            backgroundColor: discover ? color : undefined
        }}
        isFlipped={item.playerId !== undefined ? true : false}
    >
        <div className="flip-card-front"
            onClick={() => {
                const flip: IFlipIcon = { roomId, itemId: item.index, currentPlayerId: currentPlayerId };
                console.log('EMIT', flip);
                userSocket.emit('/icon/flip', flip)
            }}>
            {cheat && <span style={{ fontSize: '3rem' }}>{item.icon}</span>}
        </div>
        <div>
            {discover ? <div /> : <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                dangerouslySetInnerHTML={createMarkup(svgIcon)} />}
        </div>
    </ReactCardFlip >
}
