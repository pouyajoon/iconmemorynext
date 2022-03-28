import React from "react";
import { IBoard, IBoardItem } from "../../server/server/models";


const itemWidth = 60;
export function Board(props: { board: IBoard }) {
    const { board } = props;
    const { items, width, height } = board;
    const max = width * 60 + width * 4 + width * 2;
    console.log('ITEMS', width, height, board, items);
    return <div style={{ display: 'flex', width: max, flexDirection: 'row', flexWrap: 'wrap' }}>
        {[...items].sort((a, b) => a.index - b.index).map((item, i) => <BoardItem item={item} key={i} />)}
    </div>
}

function BoardItem(props: { item: IBoardItem }) {
    const { item } = props;
    return <div style={{
        margin: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: itemWidth, height: itemWidth, border: '1px solid blue'
    }} >{item.icon}</div>
}