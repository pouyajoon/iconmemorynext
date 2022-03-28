import React from 'react';
import { useEffect, useState } from 'react';
import { userSocket } from '../application/Application';

export function Rooms() {
    const [rooms, setRooms] = useState<IRoom[]>()

    useEffect(() => {
        userSocket.emit('/rooms', setRooms)
    }, [])

    console.log(rooms);
    if (rooms && rooms.length > 0) {
        return <div>ROOMS</div>
    }
    return <div>
        <div>no rooms</div>
        <button onClick={() => {
            console.log('add room');
            userSocket.emit('/rooms/add', (room: IRoom) => {
                console.log(room);
            });
        }}>create room</button>
    </div >;
}
