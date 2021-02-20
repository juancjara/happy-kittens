import WaitRoom from "./WaitRoom";
import Landing from "./Landing";
import Loading from "./Loading";
import { useState } from "react";
import * as Room from "./core/Room";
import * as Handle from "./core/Handle";
import RoomsAPI from "./api/RoomsAPI";

type LandingGameState = {
  type: "landing";
  error?: string;
};

type WaitRoomGameState = {
  type: "wait_room";
  room: Room.t;
  handle: Handle.t;
};

type LoadingGameState = {
  type: "loading";
};

type GameState = LandingGameState | WaitRoomGameState | LoadingGameState;

function App() {
  const [state, setState] = useState<GameState>({ type: "landing" });
  const moveToLanding = (error?: string) =>
    setState({ type: "landing", error });
  const moveToLoading = () => setState({ type: "loading" });
  const moveToWaitRoom = (room: Room.t, handle: Handle.t) =>
    setState({ type: "wait_room", room, handle });

  switch (state.type) {
    case "landing":
      return (
        <Landing
          error={state.error}
          onCreate={(handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.create(handle)
              .then((room) => moveToWaitRoom(room, handle))
              .catch(moveToLanding);
          }}
          onJoin={(room: Room.t, handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.join(room, handle)
              .then((room) => moveToWaitRoom(room, handle))
              .catch((err) => moveToLanding(JSON.stringify(err)));
          }}
        />
      );
    case "wait_room":
      return (
        <WaitRoom
          room={state.room}
          handle={state.handle}
          onLaunch={moveToLoading}
        />
      );
    case "loading":
      return <Loading />;
  }
}

export default App;
