import { FunctionComponent } from "react";
import { Piece as PieceClass } from "../classes";
import Piece from "./Piece";

type SquareProps = {
  piece: PieceClass | null;
  isDark: boolean;
  isShowSteps?: boolean;
};

const Square: FunctionComponent<SquareProps> = ({
  piece,
  isDark,
  isShowSteps,
}) => {
  return (
    <div
      className={`square ${isDark ? "dark-square" : "light-square"} ${
        isShowSteps ? "show-steps" : ""
      }`}
    >
      {piece ? <Piece type={piece.type} color={piece.color} /> : null}
    </div>
  );
};

export default Square;
