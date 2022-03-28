// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { readFileSync } from "fs";
import * as spdy from 'spdy';
// import * as core from "express-serve-static-core";
import { join, resolve } from "path";
import { Server as SocketIoServer } from 'socket.io';
import { createPlayer, getPlayer } from "./player_server";
import { createRoom, createRoomManager, getRoom, joinRoom } from "./room_server";
import { Server } from "http";

const frontDistDir = 'dist/front';

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
    registerHanders(app, manager);


    const io = new SocketIoServer(server, { serveClient: false });
    io.on('connection', (socket) => {

        console.log('new connection', socket.id);
        socket.on('/hello', (data, res) => {
            console.log('hello'.yellow, data);
            res({ cool: true });
        });

        socket.on('/rooms', (setRooms: (rooms: IRoom[]) => void) => {
            setRooms(manager.rooms);
        });
        socket.on('/rooms/add', (setRoom: (room: IRoom) => void) => {
            console.log('need add room'.green);
            const room = createRoom(manager);
            console.log('add room'.green, room);
            setRoom({} as IRoom);
        });


        socket.on("disconnect", () => {
            // sockets.delete(socket.id);
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


function registerHanders(app: express.Application, manager: IRoomManager) {

    app.get('/rooms', (req, res) => {
        res.send(manager.rooms);
    })

    app.post('/rooms', (req, res) => {
        const room = createRoom(manager);
        return res.send(room);
    })

    app.post('/players', (req, res) => {
        const id = req.body.id
        const playerName = req.body.name
        const player = createPlayer(id, playerName)
        return res.send(player);
    })

    app.get('/rooms/:roomId', (req, res) => {
        const roomId = req.params["roomId"];
        if (!(roomId in manager.rooms)) {
            return res.status(404).send({ error: "Room not found: " + roomId });
        }
        res.send(manager.rooms[roomId]);
    })

    app.post('rooms/:roomId/players', (req, res) => {
        const playerId = req.body.playerId
        const playerName = req.body.playerName
        const roomId = req.params["roomId"];
        let player;
        let room;
        try {
            player = getPlayer(playerId, playerName)
            room = getRoom(manager, roomId)
        }
        catch (e) {
            return res.status(400).send(e);
        }
        joinRoom(player, room);
        return res.send({ ok: 'True' });
    })

    app.post('/room/icons/flip', (req, res) => {
        const roomId = req.body.roomId;
        const playerId = req.body.playerId;
        const position = req.body.position;
        const flipEvent = req.body.flipEvent; // if the current request corresponds to a 2nd flip,
        // then flipEvent should contain the first flip
        try {
            const json = flipIcon(manager, roomId, playerId, position, flipEvent);
            return res.send(json);
        }
        catch (e) {
            return res.status(400).send({ error: e.message });
        }
    })
}
