import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atomFamily, useRecoilState } from 'recoil';
import { IRoom, IRoomPlayer } from '../../server/server/models';
import { createPlayer } from '../../server/server/player_server';
import { userSocket } from '../application/Application';
import { Board } from './Board';
import { EditPlayer, getPlayerFromLocalStorage, PlayerRow, PlayersList } from './PlayersList';
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

    useEffect(() => {
        if (roomId) {
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
    if (room.board.close) {
        return <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>END</h1>
                <PlayersList players={room.players} />
            </div>
        </div>
    }
    return <div>
        {currentPlayer && <EditPlayer roomId={room.id} player={currentPlayer} />}
        <div style={{ position: 'fixed', bottom: 0, left: 0 }}><PlayersList players={room.players} /></div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Board board={room.board} />
        </div>
    </div>;
}
