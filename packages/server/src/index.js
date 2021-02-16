require("dotenv").config();
const express = require("express");
const https = require("https");
const socketIO = require("socket.io");
const fs = require("fs");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const { fstat } = require("fs");
const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("../../localhost.key"),
    cert: fs.readFileSync("../../localhost.crt"),
  },
  app
);
const io = socketIO(server);

// TODO set origin url
app.use(cors());
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.static("../web/build"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../../web/build/index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(process.env.PORT, () => {
  console.log("listening on ", process.env.PORT);
});
