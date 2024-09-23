import { FunctionComponent } from "react";
import { Color, Coordinates, Piece, PieceType } from "../GameTypes";
import Square from "./Square";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  movePiece,
  pawnPromote,
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
  const {
    selectedPiece,
    possibleMoves,
    turn,
    isGameOver,
    diedPieces,
    pawnPromotion,
  } = useAppSelector((state) => state.game);

  const handleBackToHistory = (type: string): void => {
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

  const handleSelectSquare = (x: number, y: number): void => {
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

  const handlePawnPromotion = (type: PieceType): void => {
    if (pawnPromotion) {
      dispatch(pawnPromote(type));
    }
  };

  const getEdiblePositions = (x: number, y: number): boolean => {
    if (isMovePossible(x, y)) {
      const piece = board[x][y];
      if (piece && turn !== piece.color) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <div className="main">
        <div>
          {diedPieces
            .filter((piece) => piece.color === Color.WHITE)
            .map((piece, index) => (
              <span key={index}>{piece.type}</span>
            ))}
        </div>
        <div>
          <div className="wrapper">
            <div className="btn-group">
              <button onClick={() => handleBackToHistory("undo")}>undo</button>
              <button onClick={() => handleBackToHistory("redo")}>redo</button>
              <button onClick={() => handleBackToHistory("restart")}>
                restart
              </button>
            </div>
            <span>Turn: {turn}</span>
          </div>
          <div className={`chessboard ${isGameOver ? "gameover" : ""}`}>
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
                    isSelectedPiece={
                      selectedPiece
                        ? selectedPiece.position.x === rowIndex &&
                          selectedPiece.position.y === colIndex
                        : false
                    }
                    isEdible={
                      selectedPiece
                        ? getEdiblePositions(rowIndex, colIndex)
                        : false
                    }
                  />
                );
              })
            )}
            {isGameOver ? (
              <div className="gameover-message">
                {`${turn === Color.WHITE ? Color.BLACK : Color.WHITE} win`}
              </div>
            ) : (
              pawnPromotion && (
                <div
                  className={`pieces-popup ${
                    pawnPromotion.color === Color.WHITE ? "white" : "black"
                  }`}
                >
                  <div
                    className="piece-type"
                    onClick={() => handlePawnPromotion(PieceType.QUEEN)}
                  >
                    {PieceType.QUEEN}
                  </div>
                  <div
                    className="piece-type"
                    onClick={() => handlePawnPromotion(PieceType.BISHOP)}
                  >
                    {PieceType.BISHOP}
                  </div>
                  <div
                    className="piece-type"
                    onClick={() => handlePawnPromotion(PieceType.KNIGHT)}
                  >
                    {PieceType.KNIGHT}
                  </div>
                  <div
                    className="piece-type"
                    onClick={() => handlePawnPromotion(PieceType.ROOK)}
                  >
                    {PieceType.ROOK}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        <div>
          {diedPieces
            .filter((piece) => piece.color === Color.BLACK)
            .map((piece, index) => (
              <span key={index}>{piece.type}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Chessboard;
