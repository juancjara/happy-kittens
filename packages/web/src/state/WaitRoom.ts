import { useEffect, useReducer } from "react";
import * as Handle from "../core/Handle";
import Socket from "../api/Socket";
import { Room } from "shared/lib";
import { PlayerStatus } from "shared/lib/Room";
import { Player } from "shared/src/Room";
type Action<ID, Payload> = { action: ID; payload: Payload };

type SetStatus = Action<
  "player_set_status",
  {
    handle: string;
    status: PlayerStatus;
  }
>;
type Remove = Action<
  "player_remove",
  {
    handle: string;
  }
>;
type Claim = Action<
  "minigame_claim",
  {
    handle: string;
    row: number;
    col: number;
  }
>;

type Join = Action<
  "player_joined",
  {
    serialized_player: string;
  }
>;

type Sync = Action<
  "room_sync",
  {
    serialized: string;
  }
>;

export type WaitRoomActions = SetStatus | Remove | Claim | Join | Sync;

function reduce(room: Room, msg: WaitRoomActions): Room {
  switch (msg.action) {
    case "player_set_status": {
      const { payload } = msg;
      return room.setStatus(payload.handle, payload.status);
    }
    case "player_remove": {
      const { payload } = msg;
      return room.remove(payload.handle);
    }
    case "minigame_claim": {
      const { payload } = msg;
      return room.claimForMinigame(payload.handle, payload.row, payload.col);
    }
    case "player_joined": {
      const { payload } = msg;
      return room.addPlayer(Player.from(payload.serialized_player));
    }
    case "room_sync": {
      const { payload } = msg;
      return Room.from(payload.serialized);
    }
  }
}

export function useWaitRoom(
  handle: Handle.t,
  socket: Socket
): [Room, (action: WaitRoomActions) => void] {
  const [state, dispatch] = useReducer(reduce, socket.room);
  useEffect(() => {
    return socket.onMessage((action: any, payload: any) => {
      if (
        action === "player_joined" ||
        action === "player_remove" ||
        action === "player_set_status" ||
        action === "room_sync" ||
        action === "minigame_claim"
      ) {
        dispatch({ action, payload });
      }
    });
  }, [socket]);
  return [
    state,
    (message) => {
      socket.broadcast(message);
      dispatch(message);
    },
  ];
}
