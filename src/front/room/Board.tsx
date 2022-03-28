import React from "react";

export function Board(props: { board: IBoard }) {
    const { items } = props.board;
    // const items: IBoardItem[] = [{ icon: 'a' }]

    return <div style={{ display: 'flex' }}>
        {items.map((item, i) => <div key={i}>{item.icon}</div>)}
    </div>
}