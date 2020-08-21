require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// TODO set origin url
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

app.get('/', (req, res) => {
  res.json({foo: 'bar'});
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(process.env.PORT, () => {
  console.log('listening on ', process.env.PORT);
});

