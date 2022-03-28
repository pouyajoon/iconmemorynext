import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userSocket } from '../application/Application';
import { Board } from './Board';
import { PlayersList } from './PlayersList';

// props: { roomId: IRoom }
export function Room() {

    const { id } = useParams();
    const [room, setRoom] = useState<IRoom | undefined>();

    console.log(id);
    useEffect(() => {
        if (id) {
            console.log('GET', id);
            userSocket.emit('/rooms/get', id, setRoom)
        }
    }, [id])

    if (!room) {
        return <div>no room found</div>;
    }

    // const { room } = props;
    return <div>
        <h1>
            {room.id}
        </h1>
        <hr />
        <PlayersList players={room.players} />
        <hr />
        <Board board={room.board} />
    </div>;
}