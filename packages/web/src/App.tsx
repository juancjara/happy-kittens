import WaitRoom from "./WaitRoom";
import Landing from "./Landing";
import Loading from "./Loading";
import { useState } from "react";
import * as RoomCode from "./core/RoomCode";
import * as Handle from "./core/Handle";
import RoomsAPI from "./api/RoomsAPI";

type LandingGameState = {
  type: "landing";
  error?: string;
};

type WaitRoomGameState = {
  type: "wait_room";
  code: RoomCode.t;
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
  const moveToWaitRoom = (code: RoomCode.t, handle: Handle.t) =>
    setState({ type: "wait_room", code, handle });

  switch (state.type) {
    case "landing":
      return (
        <Landing
          error={state.error}
          onCreate={(handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.create(handle)
              .then((code) => moveToWaitRoom(code, handle))
              .catch((err) => moveToLanding(JSON.stringify(err)));
          }}
          onJoin={(code: RoomCode.t, handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.join(code, handle)
              .then((code) => moveToWaitRoom(code, handle))
              .catch((err) => moveToLanding(JSON.stringify(err)));
          }}
        />
      );
    case "wait_room":
      return (
        <WaitRoom
          code={state.code}
          handle={state.handle}
          onLaunch={moveToLoading}
        />
      );
    case "loading":
      return <Loading />;
  }
}

export default App;
