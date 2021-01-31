import type * as CSS from "csstype";
import { CSSProperties, useState } from "react";
import * as Room from "./core/Room";
import * as User from "./core/User";

function Row(props: {
  start?: number;
  children: React.ReactNode;
  align?: string;
  justify?: string;
}) {
  const style: CSS.Properties = {
    gridColumnStart: 2,
    gridColumnEnd: 2,
    gridRowStart: props.start,
    alignSelf: props.align,
    justifySelf: props.justify,
  };

  return <div style={style}>{props.children}</div>;
}

function Username(props: { value: User.t; onChange: (value: User.t) => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      Handle:{" "}
      <input
        defaultValue={props.value}
        onBlur={(e) => props.onChange(User.make(e.target.value))}
      ></input>
    </div>
  );
}

function Hero() {
  const style: CSSProperties = {
    textAlign: "center",
    height: "100%",
    fontWeight: "bold",
    fontSize: "xxx-large",
  };
  return <div style={style}> Happy Kitties </div>;
}

function Button(props: { label: string; onClick: () => void }) {
  const style: CSS.Properties = {
    display: "block",
    margin: "20px",
    width: "200px",
    height: "50px",
  };
  return (
    <button style={style} onClick={props.onClick}>
      {props.label}
    </button>
  );
}

function JoinButton(props: { onJoin: (room: Room.t) => void }) {
  const [intent, setIntent] = useState(false);
  const [room, setRoom] = useState(Room.make(""));
  if (intent) {
    return (
      <div>
        Room:{" "}
        <input
          defaultValue={room}
          onBlur={(e) => setRoom(Room.make(e.target.value))}
        ></input>
        <button onClick={() => props.onJoin(room)}> Go! </button>
      </div>
    );
  }
  return <Button label={"Join"} onClick={() => setIntent(true)} />;
}

function ErrorToast(props: { message: string }) {
  const [dismised, setDismised] = useState(false);
  if (dismised) {
    return null;
  }
  const style: CSS.Properties = {
    border: "solid 1px",
    padding: "32px",
  };

  return (
    <div style={style}>
      {props.message}{" "}
      <button
        style={{ display: "block", marginTop: "8px" }}
        onClick={() => setDismised(true)}
      >
        Dismiss
      </button>
    </div>
  );
}

function Landing(props: {
  error?: string;
  onCreate: (user: User.t) => void;
  onJoin: (room: Room.t, user: User.t) => void;
}) {
  const style: CSS.Properties = {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "30% auto 30%",
    gridTemplateRows: "30% 20%",
  };
  const [user, setUser] = useState(User.make(""));
  return (
    <div style={style}>
      <Row align="center" justify="center">
        {props.error ? <ErrorToast message={props.error} /> : null}
      </Row>
      <Row start={2} align="center" justify="center">
        <Hero />
      </Row>
      <Row start={3} justify="center">
        <Username value={user} onChange={setUser} />
        <Button label={"Create"} onClick={() => props.onCreate(user)} />
        <JoinButton onJoin={(room) => props.onJoin(room, user)} />
      </Row>
    </div>
  );
}

export default Landing;
