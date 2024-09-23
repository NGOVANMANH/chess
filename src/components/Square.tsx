import { FunctionComponent, memo } from "react";
import { Piece as PieceType } from "../GameTypes";
import Piece from "./Piece";

type SquareProps = {
  piece: PieceType | null;
  isDark: boolean;
  isShowSteps?: boolean;
  isSelectedPiece?: boolean;
  isEdible?: boolean;
  onSelect?: () => void;
};

const Square: FunctionComponent<SquareProps> = memo(
  ({ piece, isDark, isShowSteps, isSelectedPiece, isEdible, onSelect }) => {
    return (
      <div
        className={`square ${isDark ? "dark-square" : "light-square"} ${
          isShowSteps ? "show-steps" : ""
        } ${isSelectedPiece ? "selected" : ""} ${
          isEdible ? "edible-piece" : ""
        }`}
        onClick={onSelect ? onSelect : undefined}
      >
        {piece ? <Piece type={piece.type} color={piece.color} /> : null}
      </div>
    );
  }
);

export default Square;
