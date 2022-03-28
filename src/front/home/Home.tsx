import React from 'react';
import { SocketIoClient } from './SocketIoClient';

export function Home() {

    return <div>
        <SocketIoClient />
        'HOME !'
    </div>;
}