import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IRoom, IRoomPlayer } from '../../server/server/models';
import { userSocket } from '../application/Application';
import { Board } from './Board';
import { Player, PlayersList } from './PlayersList';

export function Room() {

    const { id } = useParams();
    const [room, setRoom] = useState<IRoom | undefined>();
    const [player, setPlayer] = useState<IRoomPlayer | undefined>();


    useEffect(() => {
        const playerId = localStorage?.getItem('playerId')
        const playerName = Math.random();
        userSocket.emit('/players/add', playerId, playerName, setPlayer)
    }, [])

    console.log(id);
    useEffect(() => {
        if (player && id) {
            console.log('GET', id);
            userSocket.emit('/rooms/get', id, setRoom)
        }
    }, [player, id])

    if (!room) {
        return <div>no room found</div>;
    }
    return <div>
        <h1>
            {room.id}
        </h1>
        <hr />
        {player && <Player player={player} />}
        <hr />
        <PlayersList players={room.players} />
        <hr />
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Board board={room.board} />
        </div>
    </div>;
}