import React, { CSSProperties, useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { IBoard, IBoardItem, IFlipIcon, IRoom } from "../../server/server/models";
import { userSocket } from "../application/Application";
import { roomAtom, useRoomId } from "./rooms.recoil";
import { svgIcons } from "./svgIcons";
import ReactCardFlip from 'react-card-flip';


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

    const currentPlayerId = localStorage?.getItem('player.id');
    if (!roomId || !currentPlayerId) {
        return null;
    }
    const { item } = props;

    const color = room?.players[item.playerId || '0']?.color;
    const flipped = item.playerId ? 'flip-card-flipped' : ''
    // const classes = `flip-card ${flipped}`
    const svgIcon = getSvgIcon(item.icon);

    if (item.discover) {
        return <div style={{
            ...itemCard,
            margin: itemCard.margin * 2,
            borderColor: color,
            backgroundColor: item.discover ? color : undefined
        }}></div>
    }
    return <ReactCardFlip
        containerStyle={{
            ...itemCard,
            borderStyle: 'solid',
            borderColor: item.playerId ? color : '#efefef'
        }}
        isFlipped={item.playerId !== undefined ? true : false}
    // data-index={item.index}
    // className={classes}

    >
        {/* className="flip-card-inner" */}
        <div className="flip-card-front"
            style={{
                // ...itemCard, color: color,
                // borderColor: item.playerId ? color : undefined
            }}
            onClick={() => {
                const flip: IFlipIcon = { roomId, itemId: item.index, currentPlayerId: currentPlayerId };
                console.log('EMIT', flip);
                userSocket.emit('/icon/flip', flip)
            }}>
        </div>
        <div>
            {item.discover ? <div style={{
                // // ...itemCard,
                // // margin: itemCard.margin * 2,
                // borderColor: color,
                backgroundColor: item.discover ? color : undefined
            }}></div> : <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
                dangerouslySetInnerHTML={createMarkup(svgIcon)} />}

        </div>
        {/* {!item.discover ? : <div />} */}
    </ReactCardFlip >
}
