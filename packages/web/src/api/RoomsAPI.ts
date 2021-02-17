import * as Room from "../core/Room";
import * as User from "../core/User";

async function post<T = void>(
  path: T extends void ? "You must provide a type parameter" : string,
  body?: Object
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

class RoomsAPI {
  static async create(user: User.t): Promise<Room.t> {
    const roomID = await post<string>("room", { user });
    return Room.make(roomID);
  }

  static async join(room: Room.t, user: User.t): Promise<Room.t> {
    const roomID = await post<string>(`room/${room}/join`, {
      user,
    });
    return Room.make(roomID);
  }
}

export default RoomsAPI;
