import * as dotenv from "dotenv";
import express from "express";
import https from "https";
import { Server } from "socket.io";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";

dotenv.config();
const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("../../localhost.key"),
    cert: fs.readFileSync("../../localhost.crt"),
  },
  app
);
const io = new Server(server);

// TODO set origin url
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.static("../web/build"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname + "/../../web/build/index.html"));
});

io.on("connection", (_socket) => {
  console.log("a user connected");
});

server.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
