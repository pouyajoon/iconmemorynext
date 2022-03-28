import { IRoom } from "./models";
import { ISocketData } from "./socket.models";

export function broadcastRoom(sockets: Map<string, ISocketData>, room?: IRoom) {
    if (room) {
        Array.from(sockets.values()).filter(sd => sd.roomId === room.id).map(sd => sd.socket.emit(`/subscribe/room/${room.id}`, room));
    }
}
