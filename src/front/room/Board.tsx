import React from "react";


const itemWidth = 60;
export function Board(props: { board: IBoard }) {
    const { items, width, height } = props.board;
    console.log(width, height)

    const max = width * 60 + width * 4 + width * 2;
    // const items: IBoardItem[] = [{ icon: 'a' }]
    console.log('ITEMS', items);
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