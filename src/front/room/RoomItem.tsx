import React from "react";
import { Link } from "react-router-dom";
import { IRoom } from "../../server/server/models";
import { PlayersList } from "./PlayersList";


const boxSize = 32;
export function RoomItem(props: { room: IRoom }) {
    const { room } = props;
    return <Link to={`/rooms/${room.id}`} >
        <div style={{ margin: 16, border: '1px solid #333', width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
            <div>
                <h3 style={{ textAlign: 'center' }}>{Object.keys(room.players).length} players</h3>
            </div>
            <div style={{ margin: 8, display: 'flex', flexWrap: 'wrap', flexDirection: 'row', width: boxSize * (Math.sqrt(room.board.size)) }}>{room.board.items.map(i => <div key={i.index} style={{ width: boxSize, height: boxSize, backgroundColor: i.discover ? room.players[i.playerId || '?']?.color : '#efefef' }}></div>)}</div>
        </div>
    </Link>
}