import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atomFamily, useRecoilState } from 'recoil';
import { IRoom, IRoomPlayer } from '../../server/server/models';
import { createPlayer } from '../../server/server/player_server';
import { userSocket } from '../application/Application';
import { Board } from './Board';
import { getPlayerFromLocalStorage, Player, PlayersList } from './PlayersList';
import { roomAtom, useRoomId } from './rooms.recoil';


export function Room() {
    const roomId = useRoomId();
    const [room, setRoom] = useRecoilState(roomAtom(roomId));
    const navigate = useNavigate();
    const lsPlayer: IRoomPlayer = getPlayerFromLocalStorage();

    const currentPlayer = room?.players[lsPlayer.id] || lsPlayer;

    useEffect(() => {
        console.log('subscribe', roomId);
        userSocket.on(`/subscribe/room/${roomId}`, (r) => {
            console.log('GET ROOM', r);
            setRoom(r);
        });
    }, [])

    console.log(roomId, room);
    useEffect(() => {
        if (roomId) {
            console.log('GET', roomId);
            userSocket.emit('/rooms/get', roomId, ((r?: IRoom) => {
                console.log('ROOM', r);
                if (!r) {
                    console.log(`Unknown room ${roomId}. Going to /`);
                    navigate('/');
                } else {
                    userSocket.emit('/players/add', currentPlayer, r.id, setRoom)
                }
            }))
        }
    }, [roomId])

    if (!room) {
        return <div>no room found</div>;
    }
    return <div>
        {currentPlayer && <Player roomId={room.id} edit={true} player={currentPlayer} />}
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
