require('dotenv').config()
const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const {nanoid} = require('nanoid');

const models = require('./models');

const app = express();
const server = http.createServer(app);

// TODO set origin url
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

const clients = {};
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', ({room, userId}, cb) => {
    console.log('join-room', room, userId);
    clients[socket.id] = {
      userId,
      room,
    }
    socket.join(room);
    const user = models.getOrCreateUser(userId);
    socket.to(room).emit('player-joined', user);
    cb({success: true})
  })

  socket.on('disconnect', reason => {
    console.log('dc', reason);
  })
});

app.get('/api/room/:userId/:roomId', (req, res) => {
  const {userId, roomId} = req.params;
  const user = models.getOrCreateUser(userId);
  models.roomAddMember({roomName: roomId, userId});

  res.json({user, room: models.getRoom(roomId)});
})

app.post('/api/room', (req, res) => {
  const ip = req.ip;
  const roomId = nanoid();

  const user = models.createUser(ip);

  models.createRoom({
    name: roomId,
    ownerId: ip,
  })

  res.json({room: models.getRoom(roomId), user});
});


server.listen(process.env.PORT, () => {
  console.log('listening on ', process.env.PORT);
});

