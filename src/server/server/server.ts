// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { readFileSync } from "fs";
import * as spdy from 'spdy';
// import * as core from "express-serve-static-core";
import { join, resolve } from "path";
import { Server as SocketIoServer, Socket } from 'socket.io';
import { createPlayer } from "./player_server";
import { createRoom, createRoomManager, getRoom, joinRoom } from "./room_server";
import { Server } from "http";
import { flipIcon } from "./board_server";
import { IFlipIcon, IRoom, IRoomManager, IRoomPlayer } from "./models";
import { stringify } from "querystring";

const frontDistDir = 'dist/front';


interface ISocketData {
    player: IRoomPlayer;
    roomId: string;
    socket: Socket;
}


function broadcastRoom(sockets: Map<string, ISocketData>, room: IRoom) {
    Array.from(sockets.values()).filter(sd => sd.roomId === room.id).map(sd => sd.socket.emit(`/subscribe/room/${room.id}`, room));
}
export function expressServer() {
    const app = express();
    app.use(cors());
    app.use(express.static(frontDistDir));
    app.use(express.urlencoded({ limit: '5mb', extended: true }));
    app.use(express.json({ limit: '5mb' }));
    if (process.env.NODE_ENV === 'production') {
        app.use(enforce.HTTPS({ trustProtoHeader: true }));
    }
    const port = process.env.PORT || 80;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    const server = new Server(app);


    const manager = createRoomManager()

    const sockets = new Map<string, ISocketData>();

    const io = new SocketIoServer(server, { serveClient: false });
    io.on('connection', (socket) => {

        console.log('new connection', socket.id);

        socket.on('/rooms', (setRooms: (rooms: IRoom[]) => void) => {
            setRooms(manager.rooms);
        });
        socket.on('/rooms/add', (setRoom: (room: IRoom) => void) => {
            setRoom(createRoom(manager));
        });
        socket.on('/rooms/get', (id: string, getRoom: (room?: IRoom) => void) => {
            try {
                const room = manager.rooms.find(r => r.id === id);
                getRoom(room)
            } catch (err) {
                console.log(err);
            }

        });
        socket.on('/players/add', (player: IRoomPlayer, roomId: string, cb: (room?: IRoom) => void) => {
            sockets.set(socket.id, { player, roomId, socket });
            try {
                const room = joinRoom(manager, player, roomId);
                broadcastRoom(sockets, room);
                cb(room);
            }
            catch (err) {
                cb(undefined);
            }
        });
        socket.on('/icon/flip', (flip: IFlipIcon, cb: (room?: IRoom) => void) => {
            try {
                const event = flipIcon(manager, flip)
                const room = getRoom(manager, flip.roomId)
                broadcastRoom(sockets, room);
                cb(room)
            } catch (err) {
                cb(undefined);
                console.log(err);
            }
        });

        socket.on("disconnect", () => {
            sockets.delete(socket.id);
            // consoleInfo("socket.io".blue, "a user disconnected", socket.id);
        });
    })

    app.get('*', function (req, res) {
        const r = resolve(join('dist/front', 'index.html'));
        // console.log(r);
        res.sendFile(r);
    });

    // app.get('/', (req, res) => {
    //     res.send({ ok: true });
    // })


    server.listen(port, () => console.debug(`🚀 icon memory ready with https on port ${port}!`.green));
    return { server, app };
    // const server = getServer(app);
}

interface IFlip {
    roomId: number;

}
