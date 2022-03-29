import React, { SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { IRoom } from '../../server/server/models';
import { userSocket } from '../application/Application';
import { RoomItem } from './RoomItem';

export function Rooms() {
    const [rooms, setRooms] = useState<IRoom[]>()

    useEffect(() => {
        userSocket.emit('/rooms', setRooms)
    }, [])

    if (rooms && rooms.length > 0) {
        return <div >
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>{rooms.map((room, i) => <RoomItem key={room.id} room={room} />)}</div>
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


export function emitCreateRoom(setRooms: (rooms: SetStateAction<IRoom[]>) => void) {
    userSocket.emit('/rooms/add', (room: IRoom) => {
        setRooms(rooms => ([...(rooms || []), room]))
    });
}

function CreateRoom(props: { setRooms: (rooms: SetStateAction<IRoom[]>) => void }) {
    return <button onClick={() => emitCreateRoom(props.setRooms)}>create room</button>

}
