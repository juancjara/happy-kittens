import { useEffect, useState } from "react";
import * as CSS from "csstype";

const TRANSITIONS = ["Loading", "Loading.", "Loading..", "Loading..."];

function LoadingIndicator() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const token = setTimeout(
      () => setFrame((frame) => (frame + 1) % TRANSITIONS.length),
      150
    );
    return () => clearTimeout(token);
  }, [frame]);

  return <div style={{ alignSelf: "center" }}>{TRANSITIONS[frame]} </div>;
}

function Loading() {
  const style: CSS.Properties = {
    display: "grid",
    height: "100%",
    textAlign: "center",
  };
  return (
    <div style={style}>
      <LoadingIndicator />
    </div>
  );
}

export default Loading;
