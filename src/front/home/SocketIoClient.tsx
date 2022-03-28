
import { useEffect } from 'react';
import { userSocket } from '../application/Application';


export function SocketIoClient() {
    useEffect(() => {
        userSocket.emit('/hello', { ok: true }, (cool) => {
            console.log(cool);
        });
    }, [])
    return null;
}