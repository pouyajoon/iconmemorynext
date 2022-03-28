// otStore: SequelizeObjectTypeStore
import cors from "cors";
import express from "express";
import enforce from "express-sslify";
import { join, resolve } from "path";
import { Server as SocketIoServer } from "socket.io";
import {
  createRoom,
  createRoomManager,
  joinRoom,
} from "./room_server";
import { Server } from "http";
import { flipIcon } from "./board_server";
import { IFlipIcon, IRoom, IRoomManager, IRoomPlayer } from "./models";
import { ISocketData } from "./socket.models";
import { broadcastRoom } from "./broadcast";

const frontDistDir = "dist/front";

function registerSockets(server: Server, manager: IRoomManager) {
  const sockets = new Map<string, ISocketData>();

  const io = new SocketIoServer(server, { serveClient: false });
  io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    socket.on("/rooms", (setRooms: (rooms: IRoom[]) => void) => {
      setRooms(manager.rooms);
    });

    socket.on("/rooms/add", (setRoom: (room: IRoom) => void) => {
      setRoom(createRoom(manager));
    });

    socket.on("/rooms/get", (id: string, getRoom: (room?: IRoom) => void) => {
      try {
        const room = manager.rooms.find((r) => r.id === id);
        getRoom(room);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on(
      "/players/add",
      (player: IRoomPlayer, roomId: string, cb: (room?: IRoom) => void) => {
        sockets.set(socket.id, { player, roomId, socket });
        try {
          const room = joinRoom(manager, player, roomId); // idempotent
          broadcastRoom(sockets, room);
          cb(room);
        } catch (err) {
          cb(undefined);
        }
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
  });
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
