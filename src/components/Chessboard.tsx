import { FunctionComponent } from "react";
import { Piece } from "../classes";
import Square from "./Square";

type ChessboardProps = {
  board: (Piece | null)[][];
};

const Chessboard: FunctionComponent<ChessboardProps> = ({ board }) => {
  return (
    <div className="chessboard">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isDark = (rowIndex + colIndex) % 2 === 0;
          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isDark={isDark}
            />
          );
        })
      )}
    </div>
  );
};

export default Chessboard;
