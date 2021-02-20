type RoomCode = string;

const ROOMS = new Map();

const ALPHA = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Room {
  constructor(public code: string, public players: Array<string>) {}
  join(handle: string): Room {
    if (this.players.some((p) => p === handle)) {
      return this;
    }
    return new Room(this.code, [...this.players, handle]);
  }
}

function getRandomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * ALPHA.length);
    code += ALPHA[index];
  }
  return code;
}

function create(handle: string): Room {
  let code = getRandomCode();
  while (ROOMS.get(code) != null) {
    code = getRandomCode();
  }
  const room = new Room(code, [handle]);
  ROOMS.set(code, room);
  return room;
}

function join(code: RoomCode, handle: string): Room | null {
  const room = ROOMS.get(code);
  if (!room) {
    return null;
  }
  const joined = room.join(handle);
  ROOMS.set(code, joined);
  return joined;
}

export default {
  create,
  join,
};
