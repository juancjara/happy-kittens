
import * as Room from "../core/Room";
import * as User from "../core/User";

class RoomsAPI {
  static create(user: User.t): Promise<Room.t> {
    return new Promise<Room.t>((resolve, _) => {
      setTimeout(() => resolve(Room.make(user)), 1000);
    });
  }

  static join(room: Room.t, user: User.t): Promise<Room.t> {
    return new Promise<Room.t>((_, reject) => {
      setTimeout(
        () =>
          reject(
            `Failed to join ${room} as ${user}. Verify that the room exist`
          ),
        1000
      );
    });
  }
}

export default RoomsAPI;