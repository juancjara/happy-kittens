import { useReducer } from "react";
import * as Player from "../core/Player";
import * as Handle from "../core/Handle";

export enum WaitPlayerStatus {
  READY = "READY",
  WAITING = "WAITING",
  DISCONNECTED = "DISCONNECTED",
}

export type WaitRoomPlayer = {
  player: Player.t;
  emoji: string;
  status: WaitPlayerStatus;
};

export type Position = {
  row: number;
  col: number;
  player: Player.t;
};

type WaitRoomState = {
  players: Array<WaitRoomPlayer>;
  claimed: Array<Position>;
};

type Action<ID, Payload> = { action: ID; payload: Payload };

type SetStatus = Action<
  "SET_STATUS",
  {
    player: Player.t;
    status: WaitPlayerStatus;
  }
>;
type Remove = Action<
  "REMOVE",
  {
    player: Player.t;
  }
>;
type Claim = Action<
  "CLAIM",
  {
    player: Player.t;
    row: number;
    col: number;
  }
>;

export type WaitRoomActions = SetStatus | Remove | Claim;

function reduce(state: WaitRoomState, msg: WaitRoomActions): WaitRoomState {
  switch (msg.action) {
    case "SET_STATUS": {
      const { payload } = msg;
      return {
        ...state,
        players: state.players.map((wp) =>
          wp.player === payload.player ? { ...wp, status: payload.status } : wp
        ),
      };
    }
    case "REMOVE": {
      const { payload } = msg;
      return {
        ...state,
        players: state.players.filter((wp) => wp.player !== payload.player),
      };
    }
    case "CLAIM": {
      const { payload } = msg;
      return {
        ...state,
        claimed: [
          ...state.claimed.filter(
            ({ row, col }) => !(row === payload.row && col === payload.col)
          ),
          payload,
        ],
      };
    }
  }
}

const MOCK_PLAYERS = ["Churretin", "Leo", "Lunita", "Goji", "Vagaso"];
const EMOJIES = ["\u2763", "\u270B", "\u270C", "\u270A", "\u270D"];

export function useWaitRoom(
  handle: Handle.t
): [WaitRoomState, (action: WaitRoomActions) => void] {
  const [state, dispatch] = useReducer(reduce, {
    players: [...MOCK_PLAYERS, handle as string].map((p, ix) => ({
      player: Player.make({ id: String(ix), handle: Handle.make(p) }),
      emoji: EMOJIES[ix % EMOJIES.length],
      status:
        ix % 3 === 0 || p === handle
          ? WaitPlayerStatus.READY
          : ix % 3 === 1
          ? WaitPlayerStatus.WAITING
          : WaitPlayerStatus.DISCONNECTED,
    })),
    claimed: [],
  });
  return [state, dispatch];
}

export const Selectors = {
  allReady(state: WaitRoomState) {
    return state.players.every((wp) => wp.status === WaitPlayerStatus.READY);
  },

  getPlayer(handle: Handle.t, state: WaitRoomState) {
    return state.players.find((wp) => wp.player.handle === handle);
  },

  getEmoji(player: Player.t, state: WaitRoomState) {
    return state.players.find((wp) => wp.player === player)?.emoji;
  },
};
