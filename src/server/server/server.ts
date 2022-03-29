// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { join, resolve } from "path";
import { Server as SocketIoServer, Socket } from "socket.io";
import {
  addPlayerToRoom,
  createRoom,
  createRoomManager,
  getRoom,
} from "./room";
import { Server } from "http";
import { flipIcon } from "./board_server";
import { IFlipIcon, IRoom, IRoomManager, IRoomPlayer } from "./models";
import { ISocketData } from "./socket.models";
import { broadcastRoom } from "./broadcast";
import { setPlayerColor, setPlayerName } from "./player";

const frontDistDir = "dist/front";

function registerSockets(server: Server, manager: IRoomManager) {
  const sockets = new Map<string, ISocketData>();
  const io = new SocketIoServer(server, { serveClient: false });

  io.on("connection", (socket) => {
    onSocketConnected(sockets, socket, manager);
  });
}

function socketSetRoom(manager: IRoomManager, setRoom: (room: IRoom) => void) {
  setRoom(createRoom(manager));
}

function onSocketConnected(
  sockets: Map<string, ISocketData>,
  socket: Socket,
  manager: IRoomManager
) {
  console.log("new connection", socket.id);

  socket.on("/rooms", (setRooms: (rooms: IRoom[]) => void) => {
    setRooms(manager.rooms);
  });

  socket.on("/rooms/add", (setRoom: (room: IRoom) => void) =>
    socketSetRoom(manager, setRoom)
  );

  socket.on("/rooms/get", (id: string, sGetRoom: (room?: IRoom) => void) => {
    try {
      const room = manager.rooms.find((r) => r.id === id);
      sGetRoom(room);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("/rooms/players/add", (roomId, playerId, color, name) => addPlayerToRoomSocket(sockets, socket, manager, roomId, playerId, color, name));


  socket.on(
    "/rooms/players/set-name",
    (roomId: string, playerId: string, name: string) => {
      const room = getRoom(manager, roomId);
      setPlayerName(room, playerId, name);
      broadcastRoom(sockets, room);
    }

  );
  socket.on(
    "/rooms/players/set-color",
    (roomId: string, playerId: string, color: string) => {
      const room = getRoom(manager, roomId);
      setPlayerColor(room, playerId, color);
      broadcastRoom(sockets, room);
    }
  );

  socket.on("/icon/flip", (flip: IFlipIcon) => {
    try {
      broadcastRoom(sockets, flipIcon(manager, sockets, flip));
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    sockets.delete(socket.id);
  });
}

function addPlayerToRoomSocket(
  sockets: Map<string, ISocketData>,
  socket: Socket,
  manager: IRoomManager,
  roomId: string,
  playerId: string,
  color: string,
  name: string
) {
  sockets.set(socket.id, { playerId, roomId, socket });
  const room = getRoom(manager, roomId);
  addPlayerToRoom(room, playerId, color, name);
  broadcastRoom(sockets, room);
}

export function expressServer() {
  const app = express();
  app.use(cors());
  app.use(express.static(frontDistDir));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));
  app.use(express.json({ limit: "5mb" }));
  if (process.env.NODE_ENV === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }
  const port = process.env.PORT || 80;
  console.log(
    "SETUP SERVER ON".blue,
    port,
    process.env.NODE_ENV,
    process.env.JUP_ENV
  );
  const server = new Server(app);
  const manager = createRoomManager();

  registerSockets(server, manager);

  app.get("*", function (req, res) {
    const r = resolve(join("dist/front", "index.html"));
    res.sendFile(r);
  });

  server.listen(port, () =>
    console.debug(`🚀 icon memory ready with https on port ${port}!`.green)
  );
  return { server, app };
}
