import { FunctionComponent } from "react";
import { Color, Coordinates, Piece } from "../types.d";
import Square from "./Square";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  movePiece,
  redoMove,
  resetGame,
  selectPiece,
  undoMove,
} from "../redux/game.slice";

type ChessboardProps = {
  board: (Piece | null)[][];
};

const Chessboard: FunctionComponent<ChessboardProps> = ({ board }) => {
  const dispatch = useAppDispatch();
  const { selectedPiece, possibleMoves, turn, isGameOver, diedPieces } =
    useAppSelector((state) => state.game);

  const handleHistory = (type: string) => {
    switch (type) {
      case "undo":
        dispatch(undoMove());
        break;
      case "redo":
        dispatch(redoMove());
        break;
      case "restart":
        dispatch(resetGame());
        break;
    }
  };

  const isMovePossible = (x: number, y: number): boolean => {
    return possibleMoves.some(
      (move: Coordinates) => move.x === x && move.y === y
    );
  };

  const handleSelectSquare = (x: number, y: number) => {
    if (selectedPiece) {
      if (isMovePossible(x, y)) {
        dispatch(movePiece({ x, y }));
      } else {
        dispatch(selectPiece(board[x][y]));
      }
    } else {
      dispatch(selectPiece(board[x][y]));
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="btn-group">
          <button onClick={() => handleHistory("undo")}>undo</button>
          <button onClick={() => handleHistory("redo")}>redo</button>
          <button onClick={() => handleHistory("restart")}>restart</button>
        </div>
        <span>Turn: {turn}</span>
      </div>
      <div className={`chessboard ${isGameOver ? "gameover" : null}`}>
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 0;
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isDark={isDark}
                onSelect={() => handleSelectSquare(rowIndex, colIndex)}
                isShowSteps={
                  selectedPiece ? isMovePossible(rowIndex, colIndex) : false
                }
              />
            );
          })
        )}
        {isGameOver && (
          <div className="gameover-message">
            {`${turn === Color.WHITE ? Color.BLACK : Color.WHITE} win`}
          </div>
        )}
      </div>
      {diedPieces &&
        diedPieces.map((piece, index) => (
          <span key={index}>
            {piece.type} {piece.color}
          </span>
        ))}
    </div>
  );
};

export default Chessboard;
