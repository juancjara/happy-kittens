import * as CSS from "csstype";
import React, { useState } from "react";
import * as Handle from "./core/Handle";
import { Player } from "shared/src/Room";
import { useWaitRoom, WaitRoomActions } from "./state/WaitRoom";
import { MiniGameContainer } from "./MiniGameContainer";
import Socket from "./api/Socket";
import { PlayerMap, PlayerStatus } from "shared/lib/Room";

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

function Code(props: { value: string }) {
  return <span>Code: {props.value}</span>;
}

const STATUS_EMOJIES = {
  [PlayerStatus.READY]: "\u2705",
  [PlayerStatus.CONNECTED]: "\u23f3",
  [PlayerStatus.DISCONNECTED]: "\u26a0",
};
const GARBAJE_EMOJI = "\u26d4";
function Players(props: {
  players: PlayerMap;
  dispatch: (action: WaitRoomActions) => void;
}) {
  const [hovered, setHovered] = useState<Player | null>(null);
  return (
    <>
      <div style={{ textAlign: "center", fontSize: "xx-large" }}>Players</div>
      <ul>
        {props.players.map((player) => {
          return (
            <li
              key={player.handle}
              style={{ lineHeight: 3, listStyle: "none" }}
              onMouseEnter={() => setHovered(player)}
              onMouseMove={() => setHovered(player)}
              onMouseLeave={() => setHovered(null)}
            >
              {STATUS_EMOJIES[player.status]}
              {` ${player.emoji} ${player.handle} `}
              {hovered === player ? (
                <button
                  onClick={() =>
                    props.dispatch({
                      action: "player_remove",
                      payload: { handle: player.handle },
                    })
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
  me: Player;
  dispatch: (actions: WaitRoomActions) => void;
}) {
  return (
    <Button
      label={props.me.status === PlayerStatus.READY ? "Wait" : "Ready"}
      onClick={() =>
        props.dispatch({
          action: "player_set_status",
          payload: {
            handle: props.me.handle,
            status:
              props.me.status === PlayerStatus.READY
                ? PlayerStatus.CONNECTED
                : PlayerStatus.READY,
          },
        })
      }
    />
  );
}

function WaitRoom(props: {
  socket: Socket;
  handle: Handle.t;
  onLaunch: () => void;
}) {
  const style: CSS.Properties = {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "60% auto",
    gridTemplateRows: "20% auto",
  };
  const [room, dispatch] = useWaitRoom(props.handle, props.socket);
  const me = room.players.get(props.handle);
  if (!me) {
    return <div> You got disconnected from the room. </div>;
  }
  return (
    <div style={style}>
      <Cell align="center" justify="center">
        <Hero />
      </Cell>
      <Cell align="center" justify="center">
        <Code value={room.code} />
      </Cell>
      <Cell>
        <div style={{ height: "60%" }}>
          {
            <MiniGameContainer
              players={room.players}
              minigame={room.minigame}
              onClaim={(row, col) =>
                dispatch({
                  action: "minigame_claim",
                  payload: { row, col, handle: me.handle },
                })
              }
            />
          }
        </div>
        <div style={{ height: "10%" }}>
          <Flex>
            {me && <StatusButton me={me} dispatch={dispatch} />}
            <Button
              label="Launch"
              disabled={!room.areAllPlayersReady()}
              onClick={props.onLaunch}
            />
          </Flex>
        </div>
      </Cell>
      <Cell>
        <Players players={room.players} dispatch={dispatch} />
      </Cell>
    </div>
  );
}

export default WaitRoom;
