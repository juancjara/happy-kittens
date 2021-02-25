import type * as CSS from "csstype";
import { CSSProperties, useState } from "react";
import * as RoomCode from "./core/RoomCode";
import * as Handle from "./core/Handle";

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

function HandleInput(props: {
  value: Handle.t;
  onChange: (value: Handle.t) => void;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      Handle:{" "}
      <input
        defaultValue={props.value}
        onBlur={(e) => props.onChange(Handle.make(e.target.value))}
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

function JoinButton(props: { onJoin: (code: RoomCode.t) => void }) {
  const [intent, setIntent] = useState(false);
  const [code, setRoomCode] = useState(RoomCode.make(""));
  if (intent) {
    return (
      <div>
        Room:{" "}
        <input
          defaultValue={code}
          onBlur={(e) => setRoomCode(RoomCode.make(e.target.value))}
        ></input>
        <button onClick={() => props.onJoin(code)}> Go! </button>
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
  onCreate: (handle: Handle.t) => void;
  onJoin: (code: RoomCode.t, handle: Handle.t) => void;
}) {
  const style: CSS.Properties = {
    height: "100%",
    display: "grid",
    gridTemplateColumns: "30% auto 30%",
    gridTemplateRows: "30% 20%",
  };
  const [handle, setHandle] = useState(Handle.make(""));
  return (
    <div style={style}>
      <Row align="center" justify="center">
        {props.error ? <ErrorToast message={props.error} /> : null}
      </Row>
      <Row start={2} align="center" justify="center">
        <Hero />
      </Row>
      <Row start={3} justify="center">
        <HandleInput value={handle} onChange={setHandle} />
        <Button label={"Create"} onClick={() => props.onCreate(handle)} />
        <JoinButton onJoin={(code) => props.onJoin(code, handle)} />
      </Row>
    </div>
  );
}

export default Landing;
