import WaitRoom from "./WaitRoom";
import Landing from "./Landing";
import Loading from "./Loading";
import { useState } from "react";
import * as RoomCode from "./core/RoomCode";
import * as Handle from "./core/Handle";
import RoomsAPI from "./api/RoomsAPI";
import Socket from "./api/Socket";

type LandingGameState = {
  type: "landing";
  error?: string;
};

type WaitRoomGameState = {
  type: "wait_room";
  socket: Socket;
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
  const moveToWaitRoom = (handle: Handle.t, socket: Socket) =>
    setState({ type: "wait_room", handle, socket });

  switch (state.type) {
    case "landing":
      return (
        <Landing
          error={state.error}
          onCreate={(handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.create(handle)
              .then((code) => Socket.connect(code, handle))
              .then(({ socket }) => moveToWaitRoom(handle, socket))
              .catch((err) => moveToLanding(JSON.stringify(err)));
          }}
          onJoin={(code: RoomCode.t, handle: Handle.t) => {
            moveToLoading();
            RoomsAPI.join(code, handle)
              .then((code) => Socket.connect(code, handle))
              .then(({ socket }) => moveToWaitRoom(handle, socket))
              .catch((err) => moveToLanding(JSON.stringify(err)));
          }}
        />
      );
    case "wait_room":
      return (
        <WaitRoom
          socket={state.socket}
          handle={state.handle}
          onLaunch={moveToLoading}
        />
      );
    case "loading":
      return <Loading />;
  }
}

export default App;
