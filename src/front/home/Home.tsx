import React from 'react';
import { Rooms } from '../room/Rooms';
import { SocketIoClient } from './SocketIoClient';

export function Home() {

    return <div>
        <SocketIoClient />
        <Rooms />
    </div>;
}