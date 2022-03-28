import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IRoom, IRoomPlayer } from '../../server/server/models';
import { createPlayer } from '../../server/server/player_server';
import { userSocket } from '../application/Application';
import { Board } from './Board';
import { Player, PlayersList } from './PlayersList';

export function Room() {

    const { id } = useParams();
    const [room, setRoom] = useState<IRoom | undefined>();

    const playerName = localStorage?.getItem('playerName') || Math.random().toString();
    const playerId = localStorage?.getItem('playerId') || createPlayer(null, playerName).id;
    const lsPlayer: IRoomPlayer = { id: playerId, name: playerName, score: 0 };

    const [player, setPlayer] = useState<IRoomPlayer>(lsPlayer);

    // useEffect(() => {
    // }, [])

    console.log(id, room);
    useEffect(() => {
        if (id) {
            console.log('GET', id);
            userSocket.emit('/rooms/get', id, ((r: IRoom) => {
                localStorage?.setItem('playerId', player.id);
                localStorage?.setItem('playerName', player.name);
                userSocket.emit('/players/add', player, r.id, setRoom)
            }))
        }
    }, [id])

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
