import * as CSS from "csstype";
import { PlayerMap, MiniGame } from "shared/lib/Room";

export type Position = {
  row: number;
  col: number;
};

export function MiniGameContainer(props: {
  players: PlayerMap;
  minigame: MiniGame;
  onClaim: (row: number, col: number) => void;
}) {
  const style: CSS.Properties = {
    display: "grid",
    height: "100%",
    gridTemplateColumns: "repeat(10, 10%)",
    gridTemplateRows: "repeat(10, 10%)",
  };
  const cellStyle: CSS.Properties = {
    border: "solid 1px",
  };
  const cells = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const value = props.minigame.getEmojiAt(props.players, i, j) || "";
      cells.push(
        <div
          key={`cell-${i}-${j}`}
          style={cellStyle}
          onClick={() => props.onClaim(i, j)}
        >
          {value}
        </div>
      );
    }
  }
  return <div style={style}>{cells}</div>;
}
