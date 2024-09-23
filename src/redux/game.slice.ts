import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Piece, Coordinates, Color, PieceType } from "../GameTypes";
import {
  calculatePossibleMoves,
  checkGameOver,
  initBoard,
} from "./game.helper";

type BoardState = {
  board: (Piece | null)[][];
  turn: Color;
  isGameOver: boolean | null;
  pawnPromotion: Piece | null;
  diedPieces: Piece[];
};

type GameState = {
  board: (Piece | null)[][];
  turn: Color | null;
  pawnPromotion: Piece | null;
  possibleMoves: Coordinates[];
  isGameOver: boolean | null;
  diedPieces: Piece[];
  selectedPiece: Piece | null;
  undoStack: BoardState[];
  redoStack: BoardState[];
};

const initialGameState: GameState = {
  board: initBoard,
  selectedPiece: null,
  pawnPromotion: null,
  possibleMoves: [],
  turn: Color.WHITE,
  undoStack: [],
  redoStack: [],
  isGameOver: false,
  diedPieces: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    // Select a piece and calculate its possible moves
    selectPiece(state, action: PayloadAction<Piece | null>) {
      const isMyTurn = state.turn === action.payload?.color;

      if (!isMyTurn) {
        return;
      }

      const isSamePiece =
        state.selectedPiece &&
        action.payload &&
        state.selectedPiece.position.x === action.payload.position.x &&
        state.selectedPiece.position.y === action.payload.position.y &&
        state.selectedPiece.type === action.payload.type &&
        state.selectedPiece.color === action.payload.color;

      if (isSamePiece) {
        state.selectedPiece = null;
        state.possibleMoves = [];
      } else {
        state.selectedPiece = action.payload;
        state.possibleMoves = action.payload
          ? calculatePossibleMoves(action.payload, state.board)
          : [];
      }
    },

    // Move a piece to a new position
    movePiece(state, action: PayloadAction<Coordinates>) {
      const targetPosition = action.payload;
      const diedPiece = state.board[targetPosition.x][targetPosition.y];

      if (state.selectedPiece) {
        const { x: currentX, y: currentY } = state.selectedPiece.position;

        // Backup current state for undo
        state.undoStack.push({
          board: JSON.parse(JSON.stringify(state.board)),
          turn: state.turn!,
          isGameOver: state.isGameOver!,
          pawnPromotion: JSON.parse(JSON.stringify(state.pawnPromotion)),
          diedPieces: JSON.parse(JSON.stringify(state.diedPieces)),
        });

        // Clear redo stack on new move
        state.redoStack = [];

        // Move the piece
        state.board[currentX][currentY] = null;
        state.board[targetPosition.x][targetPosition.y] = {
          ...state.selectedPiece,
          position: targetPosition,
        };

        // Update died piece
        if (diedPiece) state.diedPieces.push(diedPiece);

        // Check king position
        if (checkGameOver(state.board)) {
          state.isGameOver = true;
        }

        // check pawn promote
        if (state.selectedPiece.type === PieceType.PAWN) {
          const promotableXCoordinate = state.turn === Color.WHITE ? 0 : 7;
          if (targetPosition.x === promotableXCoordinate) {
            state.pawnPromotion = {
              ...state.selectedPiece,
              position: targetPosition,
            };
          }
        } else state.pawnPromotion = null;

        // Deselect piece and reset possible moves
        state.selectedPiece = null;
        state.possibleMoves = [];

        // Change turn
        state.turn = state.turn === Color.WHITE ? Color.BLACK : Color.WHITE;
      }
    },

    // Undo the last move
    undoMove(state) {
      if (state.undoStack.length > 0) {
        // Store the current state in the redo stack
        state.redoStack.push({
          board: JSON.parse(JSON.stringify(state.board)),
          turn: state.turn!,
          isGameOver: state.isGameOver!,
          pawnPromotion: JSON.parse(JSON.stringify(state.pawnPromotion)),
          diedPieces: JSON.parse(JSON.stringify(state.diedPieces)), // Deep clone diedPiece
        });

        // Restore the previous state
        const lastState = state.undoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;
        state.isGameOver = lastState!.isGameOver;
        state.pawnPromotion = lastState!.pawnPromotion;
        state.diedPieces = lastState!.diedPieces; // Restore diedPiece

        // Deselect any selected piece and clear possible moves
        state.selectedPiece = null;
        state.possibleMoves = [];
      }
    },

    // Redo the last undone move
    redoMove(state) {
      if (state.redoStack.length > 0) {
        // Store the current state in the undo stack
        state.undoStack.push({
          board: JSON.parse(JSON.stringify(state.board)),
          turn: state.turn!,
          isGameOver: state.isGameOver!,
          pawnPromotion: JSON.parse(JSON.stringify(state.pawnPromotion!)),
          diedPieces: JSON.parse(JSON.stringify(state.diedPieces)), // Deep clone diedPiece
        });

        // Restore the state from the redo stack
        const lastState = state.redoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;
        state.isGameOver = lastState!.isGameOver;
        state.pawnPromotion = lastState!.pawnPromotion;
        state.diedPieces = lastState!.diedPieces; // Restore diedPiece

        // Deselect any selected piece and clear possible moves
        state.selectedPiece = null;
        state.possibleMoves = [];
      }
    },

    // Reset the game to the initial state
    resetGame(state) {
      state.board = initBoard;
      state.selectedPiece = null;
      state.possibleMoves = [];
      state.turn = Color.WHITE;
      state.undoStack = [];
      state.redoStack = [];
      state.isGameOver = false;
      state.pawnPromotion = null;
      state.diedPieces = [];
    },

    // Promote pawn
    pawnPromote(state, action: PayloadAction<PieceType>) {
      if (state.pawnPromotion) {
        const { x, y } = state.pawnPromotion.position;

        const piece = state.board[x][y];

        if (!piece || piece.type !== PieceType.PAWN) return;

        if (
          [
            PieceType.QUEEN,
            PieceType.BISHOP,
            PieceType.KNIGHT,
            PieceType.ROOK,
          ].includes(action.payload)
        ) {
          state.board[x][y] = {
            ...piece,
            type: action.payload,
          };
          state.pawnPromotion = null;
        }
      }
    },
  },
});

export const {
  selectPiece,
  movePiece,
  undoMove,
  redoMove,
  resetGame,
  pawnPromote,
} = gameSlice.actions;

export default gameSlice.reducer;
