import WaitRoom from "./WaitRoom";
import Landing from "./Landing";
import Loading from "./Loading";
import { useState } from "react";
import * as Room from "./core/Room";
import * as User from "./core/User";

type LandingGameState = {
  type: "landing";
  error?: string;
};

type WaitRoomGameState = {
  type: "wait_room";
  room: Room.t;
  user: User.t;
};

type LoadingGameState = {
  type: "loading";
};

type GameState = LandingGameState | WaitRoomGameState | LoadingGameState;

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

function App() {
  const [state, setState] = useState<GameState>({ type: "landing" });
  const moveToLanding = (error?: string) =>
    setState({ type: "landing", error });
  const moveToLoading = () => setState({ type: "loading" });
  const moveToWaitRoom = (room: Room.t, user: User.t) =>
    setState({ type: "wait_room", room, user });
  switch (state.type) {
    case "landing":
      return (
        <Landing
          error={state.error}
          onCreate={(user: User.t) => {
            moveToLoading();
            RoomsAPI.create(user)
              .then((room) => moveToWaitRoom(room, user))
              .catch(moveToLanding);
          }}
          onJoin={(room: Room.t, user: User.t) => {
            moveToLoading();
            RoomsAPI.join(room, user)
              .then((room) => moveToWaitRoom(room, user))
              .catch(moveToLanding);
          }}
        />
      );
    case "wait_room":
      return <WaitRoom room={state.room} user={state.user} />;
    case "loading":
      return <Loading />;
  }
}

export default App;
