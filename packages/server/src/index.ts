import * as dotenv from "dotenv";
import express from "express";
import https from "https";
import { Server } from "socket.io";
import fs from "fs";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import RoomStore from "./RoomStore";
import { PlayerStatus, Room } from "shared/lib/Room";

dotenv.config();
const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("./localhost.key"),
    cert: fs.readFileSync("./localhost.crt"),
  },
  app
);
const io = new Server(server);

// TODO set origin url
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.static("../web/build"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname + "/../../web/build/index.html"));
});

app.post("/room", (req, res) => {
  const { handle } = req.body;
  const room = RoomStore.create(handle);
  res.send({ code: room.code });
});

app.post("/room/:id/join", (req, res) => {
  const { handle } = req.body;
  const room = RoomStore.join(req.params.id, handle);
  if (room) {
    RoomStore.set(room.code, room);
    res.send({ code: req.params.id });
    io.to(room.code).emit("player_joined", {
      serialized_player: room.players.get(handle)?.serialize(),
    });
  } else {
    res.sendStatus(404);
  }
});

io.use((socket, next) => {
  const { handle, code } = socket.handshake.auth;
  if (!handle) {
    return next(new Error("Missing handle"));
  } else if (!RoomStore.get(code)) {
    return next(new Error("Room doesn't exist"));
  }
  next();
});

io.on("connection", (socket) => {
  const { code } = socket.handshake.auth;
  const room = RoomStore.getEnforce(code);
  socket.join(room.code);
  socket.emit("room_sync", room.serialize());
  socket.on("player_remove", (payload: { handle: string }) => {
    const room = RoomStore.get(code);
    if (room) {
      RoomStore.set(code, room.remove(payload.handle));
      socket.to(code).emit("player_remove", payload);
    }
  });
  socket.on(
    "player_set_status",
    (payload: { handle: string; status: PlayerStatus }) => {
      const room = RoomStore.get(code);
      if (room) {
        RoomStore.set(code, room.setStatus(payload.handle, payload.status));
        socket.to(code).emit("player_set_status", payload);
      }
    }
  );
});

server.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
