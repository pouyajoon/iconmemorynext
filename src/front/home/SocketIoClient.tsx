import openSocket from "socket.io-client";
import { useEffect } from 'react';

export const userSocket = openSocket('https://localhost', { transports: ['websocket'] });
export function SocketIoClient() {
    useEffect(() => {
        userSocket.emit('/hello', { ok: true }, (cool) => {
            console.log(cool);
        });
    }, [])
    return null;
}