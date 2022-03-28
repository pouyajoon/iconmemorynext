import React, { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { userSocket } from '../application/Application';
import { RoomItem } from './RoomItem';

export function Rooms() {
    const [rooms, setRooms] = useState<IRoom[]>()

    useEffect(() => {
        userSocket.emit('/rooms', setRooms)
    }, [])

    console.log(rooms);
    if (rooms && rooms.length > 0) {
        return <div>
            {rooms.map((room, i) => <RoomItem key={i} room={room} />)}
            <hr />
            <CreateRoom setRooms={setRooms} />
        </div>
    }
    return <div>
        <div>no rooms</div>
        <hr />
        <CreateRoom setRooms={setRooms} />
    </div >;
}

function CreateRoom(props: { setRooms: (rooms: SetStateAction<IRoom[]>) => void }) {
    return <button onClick={() => {
        userSocket.emit('/rooms/add', (room: IRoom) => {
            props.setRooms(rooms => ([...(rooms || []), room]))
        });
    }}>create room</button>

}
