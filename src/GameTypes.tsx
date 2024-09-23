export enum Color {
  WHITE = "white",
  BLACK = "black",
}

export enum PieceType {
  PAWN = "♟",
  ROOK = "♜",
  KNIGHT = "♞",
  BISHOP = "♝",
  QUEEN = "♛",
  KING = "♚",
}

export type Coordinates = {
  x: number;
  y: number;
};

export type Piece = {
  position: Coordinates;
  type: PieceType;
  color: Color;
};
