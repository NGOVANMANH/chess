import { createSlice } from "@reduxjs/toolkit";
import {
  Bishop,
  Color,
  King,
  Knight,
  Pawn,
  Piece,
  Queen,
  Rook,
} from "../classes";

const initialBoard: (Piece | null)[][] = [
  [
    new Rook(Color.BLACK),
    new Knight(Color.BLACK),
    new Bishop(Color.BLACK),
    new Queen(Color.BLACK),
    new King(Color.BLACK),
    new Bishop(Color.BLACK),
    new Knight(Color.BLACK),
    new Rook(Color.BLACK),
  ],
  Array.from({ length: 8 }, () => new Pawn(Color.BLACK)), // Corrected
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array.from({ length: 8 }, () => new Pawn(Color.WHITE)), // Corrected
  [
    new Rook(Color.WHITE),
    new Knight(Color.WHITE),
    new Bishop(Color.WHITE),
    new Queen(Color.WHITE),
    new King(Color.WHITE),
    new Bishop(Color.WHITE),
    new Knight(Color.WHITE),
    new Rook(Color.WHITE),
  ],
];

initialBoard.forEach((row, rowIndex) => {
  row.forEach((piece, colIndex) => {
    if (piece) {
      piece.initialCoordinates(rowIndex, colIndex);
    }
  });
});

const chessBoardSlice = createSlice({
  name: "chessBoard",
  initialState: initialBoard,
  reducers: {},
});

export const {} = chessBoardSlice.actions;

export default chessBoardSlice.reducer;
