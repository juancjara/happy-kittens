import { Room } from "shared";

type RoomCode = string;

const ROOMS: Map<RoomCode, Room> = new Map();

const ALPHA = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
  const room = Room.forHost(code, handle);
  ROOMS.set(code, room);
  return room;
}

function get(code: RoomCode): Room | undefined {
  const room = ROOMS.get(code);
  return room;
}

function getEnforce(code: RoomCode): Room {
  const room = ROOMS.get(code);
  if (!room) {
    throw new Error("Room doesn't exist");
  }
  return room;
}

function join(code: RoomCode, handle: string): Room | undefined {
  const room = get(code);
  if (!room) {
    return undefined;
  }
  const joined = room.join(handle);
  ROOMS.set(code, joined);
  return joined;
}

function set(code: RoomCode, room: Room): void {
  ROOMS.set(code, room);
}

export default {
  get,
  getEnforce,
  set,
  create,
  join,
};
