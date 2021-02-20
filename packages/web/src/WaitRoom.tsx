import * as CSS from "csstype";
import React, { useState } from "react";
import * as RoomCode from "./core/RoomCode";
import * as Handle from "./core/Handle";
import * as Player from "./core/Player";
import {
  useWaitRoom,
  WaitRoomActions,
  WaitRoomPlayer,
  WaitPlayerStatus,
  Selectors,
} from "./state/WaitRoom";
import { MiniGame } from "./MiniGame";

function Cell(props: {
  children: React.ReactNode;
  align?: string;
  justify?: string;
}) {
  const style: CSS.Properties = {
    alignSelf: props.align,
    justifySelf: props.justify,
  };

  return <div style={style}>{props.children}</div>;
}

function Flex(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "space-evenly",
        marginTop: "16px",
      }}
    >
      {props.children}
    </div>
  );
}

function Button(props: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      style={{ width: "200px" }}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {" "}
      {props.label}
    </button>
  );
}

function Hero() {
  const style: CSS.Properties = {
    textAlign: "center",
    height: "100%",
    fontWeight: "bold",
    fontSize: "xxx-large",
  };
  return <div style={style}> Happy Kitties </div>;
}

function Code(props: { value: RoomCode.t }) {
  return <span>Code: {props.value}</span>;
}

const STATUS_EMOJIES = {
  [WaitPlayerStatus.READY]: "\u2705",
  [WaitPlayerStatus.WAITING]: "\u23f3",
  [WaitPlayerStatus.DISCONNECTED]: "\u26a0",
};
const GARBAJE_EMOJI = "\u26d4";
function Players(props: {
  players: Array<WaitRoomPlayer>;
  dispatch: (action: WaitRoomActions) => void;
}) {
  const [hovered, setHovered] = useState<Player.t | null>(null);
  return (
    <>
      <div style={{ textAlign: "center", fontSize: "xx-large" }}>Players</div>
      <ul>
        {props.players.map(({ player, status, emoji }) => {
          return (
            <li
              key={player.id}
              style={{ lineHeight: 3, listStyle: "none" }}
              onMouseEnter={() => setHovered(player)}
              onMouseMove={() => setHovered(player)}
              onMouseLeave={() => setHovered(null)}
            >
              {STATUS_EMOJIES[status]}
              {` ${emoji} ${player.handle} `}
              {hovered === player ? (
                <button
                  onClick={() =>
                    props.dispatch({ action: "REMOVE", payload: { player } })
                  }
                >
                  {GARBAJE_EMOJI}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function StatusButton(props: {
  me: WaitRoomPlayer;
  dispatch: (actions: WaitRoomActions) => void;
}) {
  return (
    <Button
      label={props.me.status === WaitPlayerStatus.READY ? "Wait" : "Ready"}
      onClick={() =>
        props.dispatch({
          action: "SET_STATUS",
          payload: {
            player: props.me.player,
            status:
              props.me.status === WaitPlayerStatus.READY
                ? WaitPlayerStatus.WAITING
                : WaitPlayerStatus.READY,
          },
        })
      }
    />
  );
}

function WaitRoom(props: {
  code: RoomCode.t;
  handle: Handle.t;
  onLaunch: () => void;
}) {
  const style: CSS.Properties = {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "60% auto",
    gridTemplateRows: "20% auto",
  };
  const [state, dispatch] = useWaitRoom(props.handle);
  const me = Selectors.getPlayer(props.handle, state);
  return (
    <div style={style}>
      <Cell align="center" justify="center">
        <Hero />
      </Cell>
      <Cell align="center" justify="center">
        <Code value={props.code} />
      </Cell>
      <Cell>
        <div style={{ height: "60%" }}>
          {me && (
            <MiniGame
              claimed={state.claimed}
              onClaim={(row, col) =>
                dispatch({
                  action: "CLAIM",
                  payload: { row, col, player: me.player },
                })
              }
              getEmoji={(player) => Selectors.getEmoji(player, state)}
            />
          )}
        </div>
        <div style={{ height: "10%" }}>
          <Flex>
            {me && <StatusButton me={me} dispatch={dispatch} />}
            <Button
              label="Launch"
              disabled={!Selectors.allReady(state)}
              onClick={props.onLaunch}
            />
          </Flex>
        </div>
      </Cell>
      <Cell>
        <Players players={state.players} dispatch={dispatch} />
      </Cell>
    </div>
  );
}

export default WaitRoom;
