// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { readFileSync } from "fs";
import * as spdy from 'spdy';
// import * as core from "express-serve-static-core";
import { join, resolve } from "path";
import { createPlayer, getPlayer } from "./player_server";
import { createRoom, createRoomManager, getRoom, joinRoom } from "./room_server";

const frontDistDir = 'dist/front';

function getServer(app: express.Application) {
    const key = readFileSync(`./cert/keys/server.key`, 'utf8');
    const cert = readFileSync(`./cert/keys/server.crt`, 'utf8');
    const credentials: spdy.server.ServerOptions = { key, cert, spdy: { plain: false } };
    return spdy.createServer(credentials, app);
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
    const port = process.env.PORT || 443;
    console.log("SETUP SERVER ON".blue, port, process.env.NODE_ENV, process.env.JUP_ENV);
    const server = getServer(app);

    app.get('*', function (req, res) {
        const r = resolve(join('dist/front', 'index.html'));
        res.sendFile(r);
    });

    // app.get('/', (req, res) => {
    //     res.send({ ok: true });
    // })

    const manager = createRoomManager()
    registerHanders(app, manager);

    server.listen(port, () => console.debug(`🚀 icon memory ready with https on port ${port}!`.green));
    return { server, app };
    // const server = getServer(app);
}


function registerHanders(app: express.Application, manager: IRoomManager) {
    app.post('/room', (req, res) => {
        const room = createRoom(manager);
        return res.send(room);
    })

    app.post('/players', (req, res) => {
        const id = req.body.id
        const playerName = req.body.name
        const player = createPlayer(id, playerName)
        return res.send(player);
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
        try {
            const json = flipIcon(manager, roomId, playerId, position);
            return res.send(json);
        }
        catch (e) {
            return res.status(400).send({ error: e.message });
        }
    })
}
