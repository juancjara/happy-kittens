import * as dotenv from "dotenv";
import express from "express";
import https from "https";
import { Server } from "socket.io";
import fs from "fs";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import RoomStore from "./RoomStore";

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
    res.send({ code: req.params.id });
  } else {
    res.sendStatus(404);
  }
});

io.on("connection", (_socket) => {
  console.log("a user connected");
});

server.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
