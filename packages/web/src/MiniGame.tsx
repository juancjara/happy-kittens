import * as CSS from "csstype";

export type Position = {
  row: number;
  col: number;
};

export function MiniGame(props: {
  claimed: Array<Position>;
  onClaim: (row: number, col: number) => void;
  //  getEmoji: (player: Player.t) => string | undefined;
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
      const pos = props.claimed.find(({ row, col }) => row === i && col === j);
      const value = ""; // pos?.player && ""; // props.getEmoji(pos.player);
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
