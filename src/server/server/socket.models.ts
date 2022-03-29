import { Socket } from "socket.io";

export interface ISocketData {
    playerId: string;
    roomId: string;
    socket: Socket;
}
