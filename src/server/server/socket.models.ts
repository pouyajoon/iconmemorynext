import { Socket } from "socket.io";
import { IRoomPlayer } from "./models";

export interface ISocketData {
    player: IRoomPlayer;
    roomId: string;
    socket: Socket;
}
