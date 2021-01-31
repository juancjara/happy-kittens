import { useEffect, useState } from "react";
import * as CSS from "csstype";

function LoadingIndicator() {
  const transitions = ["Loading"];
  for (let i = 0; i < 3; i++) {
    transitions.push(transitions[i] + ".");
  }
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    console.log("hello");
    const token = setTimeout(
      () => setFrame((frame) => (frame + 1) % transitions.length),
      150
    );
    return () => clearTimeout(token);
  }, [frame]);

  return <div style={{ alignSelf: "center" }}>{transitions[frame]} </div>;
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
