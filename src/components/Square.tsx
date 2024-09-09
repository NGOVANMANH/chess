import { FunctionComponent, memo } from "react";
import { Piece as PieceType } from "../types";
import Piece from "./Piece";

type SquareProps = {
  piece: PieceType | null;
  isDark: boolean;
  isShowSteps?: boolean;
  onSelect?: () => void;
};

const Square: FunctionComponent<SquareProps> = memo(
  ({ piece, isDark, isShowSteps, onSelect }) => {
    return (
      <div
        className={`square ${isDark ? "dark-square" : "light-square"} ${
          isShowSteps ? "show-steps" : ""
        }`}
        onClick={onSelect ? onSelect : undefined}
      >
        {piece ? <Piece type={piece.type} color={piece.color} /> : null}
      </div>
    );
  }
);

export default Square;
