import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Piece, Coordinates } from "../types.d";
import { calculatePossibleMoves, initBoard } from "./game.init";

type GameState = {
  board: (Piece | null)[][];
  selectedPiece: Piece | null;
  possibleMoves: Coordinates[];
  turn: string | null;
  undoStack: { board: (Piece | null)[][]; turn: string }[];
  redoStack: { board: (Piece | null)[][]; turn: string }[];
};

const initialGameState: GameState = {
  board: initBoard,
  selectedPiece: null,
  possibleMoves: [],
  turn: "WHITE",
  undoStack: [],
  redoStack: [],
};

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    // Select a piece and calculate its possible moves
    selectPiece(state, action: PayloadAction<Piece | null>) {
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
      const { selectedPiece, board, turn } = state;
      const targetPosition = action.payload;

      if (selectedPiece) {
        const { x: currentX, y: currentY } = selectedPiece.position;

        // Backup current state for undo
        state.undoStack.push({
          board: JSON.parse(JSON.stringify(board)), // Deep clone of the board
          turn: turn!,
        });

        // Clear redo stack on new move
        state.redoStack = [];

        // Move the piece
        board[currentX][currentY] = null;
        board[targetPosition.x][targetPosition.y] = {
          ...selectedPiece,
          position: targetPosition,
        };

        // Deselect piece and reset possible moves
        state.selectedPiece = null;
        state.possibleMoves = [];

        // Change turn
        state.turn = turn === "WHITE" ? "BLACK" : "WHITE";
      }
    },

    // Undo the last move
    undoMove(state) {
      if (state.undoStack.length > 0) {
        // Store the current state in the redo stack
        state.redoStack.push({
          board: JSON.parse(JSON.stringify(state.board)),
          turn: state.turn!,
        });

        // Restore the previous state
        const lastState = state.undoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;

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
        });

        // Restore the state from the redo stack
        const lastState = state.redoStack.pop();
        state.board = lastState!.board;
        state.turn = lastState!.turn;

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
      state.turn = "WHITE";
      state.undoStack = [];
      state.redoStack = [];
    },
  },
});

export const { selectPiece, movePiece, undoMove, redoMove, resetGame } =
  gameSlice.actions;

export default gameSlice.reducer;
