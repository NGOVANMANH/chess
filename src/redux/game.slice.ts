import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Piece, Coordinates, Color, PieceType } from "../types.d";
import { calculatePossibleMoves, initBoard } from "./game.helper";

type GameState = {
  board: (Piece | null)[][];
  selectedPiece: Piece | null;
  possibleMoves: Coordinates[];
  turn: Color | null;
  undoStack: {
    board: (Piece | null)[][];
    turn: Color;
    isGameOver: boolean | null;
    diedPieces: Piece[];
  }[];
  redoStack: {
    board: (Piece | null)[][];
    turn: Color;
    isGameOver: boolean | null;
    diedPieces: Piece[];
  }[];
  isGameOver: boolean | null;
  diedPieces: Piece[];
};

const initialGameState: GameState = {
  board: initBoard,
  selectedPiece: null,
  possibleMoves: [],
  turn: Color.WHITE,
  undoStack: [],
  redoStack: [],
  isGameOver: false,
  diedPieces: [],
};

const checkGameOver = (board: (Piece | null)[][]): boolean => {
  let kingCount = 0;
  board.forEach((row) => {
    row.forEach((piece) => {
      if (piece?.type === PieceType.KING) {
        kingCount++;
      }
    });
  });
  return kingCount < 2;
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
          board: JSON.parse(JSON.stringify(state.board)), // Deep clone of the board
          turn: state.turn!,
          isGameOver: state.isGameOver!,
          diedPieces: state.diedPieces!,
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

        // Deselect piece and reset possible moves
        state.selectedPiece = null;
        state.possibleMoves = [];

        // Check king position
        if (checkGameOver(state.board)) {
          state.isGameOver = true;
        }

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
          diedPieces: state.diedPieces, // Deep clone diedPiece
        });

        // Restore the previous state
        const lastState = state.undoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;
        state.isGameOver = lastState!.isGameOver;
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
          diedPieces: state.diedPieces, // Deep clone diedPiece
        });

        // Restore the state from the redo stack
        const lastState = state.redoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;
        state.isGameOver = lastState!.isGameOver;
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
      state.diedPieces = [];
    },
  },
});

export const { selectPiece, movePiece, undoMove, redoMove, resetGame } =
  gameSlice.actions;

export default gameSlice.reducer;
