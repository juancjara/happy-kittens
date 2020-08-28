const rooms = {};
const users = {};

const createUser = (userId) => {
  users[userId] = {id: userId, username: userId}
  return users[userId];
}

const getUser = (userId) => {
  return users[userId]
}

const getOrCreateUser = (userId) => {
  const user = getUser(userId);
  return user || createUser(userId);
}

const removeUser = ({userId}) => {
  delete users[userId]
}

const createRoom = ({name, ownerId}) => {
  rooms[name] = {
    name,
    ownerId,
    members: [ownerId],
  }
}

const getRoom = (name) => {
  return {
    ...rooms[name],
    members: rooms[name].members.map(id => users[id])
  }
};

const roomAddMember = ({roomName, userId}) => {
  if (rooms[roomName].members.indexOf(userId) === -1) {
    rooms[roomName].members.push(userId);
  }
}

module.exports = {
  createUser,
  getOrCreateUser,
  removeUser,
  getRoom,
  createRoom,
  roomAddMember
}
