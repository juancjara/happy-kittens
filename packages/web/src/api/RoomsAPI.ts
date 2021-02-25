import * as RoomCode from "../core/RoomCode";
import * as Handle from "../core/Handle";

async function post<T = void>(
  path: T extends void ? "You must provide a type parameter" : string,
  body?: Object
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return (await res.json()) as T;
}

class RoomsAPI {
  static async create(handle: Handle.t): Promise<RoomCode.t> {
    const { code } = await post<{ code: string }>("room", { handle });
    return RoomCode.make(code);
  }

  static async join(room: RoomCode.t, handle: Handle.t): Promise<RoomCode.t> {
    const { code } = await post<{ code: string }>(`room/${room}/join`, {
      handle,
    });
    return RoomCode.make(code);
  }
}

export default RoomsAPI;
