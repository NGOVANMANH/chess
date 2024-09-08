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

export abstract class Piece {
  public xCoordinate: number;
  public yCoordinate: number;
  constructor(public type: PieceType, public color: Color) {
    this.xCoordinate = -1;
    this.yCoordinate = -1;
  }
  public abstract move(): void;
  public abstract eat(): void;
  public initialCoordinates(x: number, y: number): void {
    this.xCoordinate = x;
    this.yCoordinate = y;
  }
}

export class Pawn extends Piece {
  constructor(color: Color) {
    super(PieceType.PAWN, color);
  }
  public move = () => {};
  public eat = () => {};
}

export class Rook extends Piece {
  constructor(color: Color) {
    super(PieceType.ROOK, color);
  }
  public move = () => {};
  public eat = () => {};
}

export class Knight extends Piece {
  constructor(color: Color) {
    super(PieceType.KNIGHT, color);
  }
  public move = () => {};
  public eat = () => {};
}

export class Bishop extends Piece {
  constructor(color: Color) {
    super(PieceType.BISHOP, color);
  }
  public move = () => {};
  public eat = () => {};
}

export class Queen extends Piece {
  constructor(color: Color) {
    super(PieceType.QUEEN, color);
  }
  public move = () => {};
  public eat = () => {};
}

export class King extends Piece {
  constructor(color: Color) {
    super(PieceType.KING, color);
  }
  public move = () => {};
  public eat = () => {};
}
