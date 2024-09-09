import { Color, Coordinates, Piece, PieceType } from "../types.d";

export const initBoard: (Piece | null)[][] = [
  [
    { type: PieceType.ROOK, color: Color.BLACK, position: { x: 0, y: 0 } },
    { type: PieceType.KNIGHT, color: Color.BLACK, position: { x: 0, y: 1 } },
    { type: PieceType.BISHOP, color: Color.BLACK, position: { x: 0, y: 2 } },
    { type: PieceType.QUEEN, color: Color.BLACK, position: { x: 0, y: 3 } },
    { type: PieceType.KING, color: Color.BLACK, position: { x: 0, y: 4 } },
    { type: PieceType.BISHOP, color: Color.BLACK, position: { x: 0, y: 5 } },
    { type: PieceType.KNIGHT, color: Color.BLACK, position: { x: 0, y: 6 } },
    { type: PieceType.ROOK, color: Color.BLACK, position: { x: 0, y: 7 } },
  ],
  Array.from({ length: 8 }, (_, y) => ({
    type: PieceType.PAWN,
    color: Color.BLACK,
    position: { x: 1, y },
  })),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array.from({ length: 8 }, (_, y) => ({
    type: PieceType.PAWN,
    color: Color.WHITE,
    position: { x: 6, y },
  })),
  [
    { type: PieceType.ROOK, color: Color.WHITE, position: { x: 7, y: 0 } },
    { type: PieceType.KNIGHT, color: Color.WHITE, position: { x: 7, y: 1 } },
    { type: PieceType.BISHOP, color: Color.WHITE, position: { x: 7, y: 2 } },
    { type: PieceType.QUEEN, color: Color.WHITE, position: { x: 7, y: 3 } },
    { type: PieceType.KING, color: Color.WHITE, position: { x: 7, y: 4 } },
    { type: PieceType.BISHOP, color: Color.WHITE, position: { x: 7, y: 5 } },
    { type: PieceType.KNIGHT, color: Color.WHITE, position: { x: 7, y: 6 } },
    { type: PieceType.ROOK, color: Color.WHITE, position: { x: 7, y: 7 } },
  ],
];

// game logic
export const calculatePossibleMoves = (
  piece: Piece,
  board: (Piece | null)[][]
): Coordinates[] => {
  const { type, color, position } = piece;
  const possibleMoves: Coordinates[] = [];

  const isWithinBounds = (x: number, y: number) =>
    x >= 0 && x < 8 && y >= 0 && y < 8;

  const addMove = (x: number, y: number): boolean => {
    if (isWithinBounds(x, y)) {
      const targetPiece = board[x][y];
      if (!targetPiece) {
        possibleMoves.push({ x, y });
        return true; // Continue in this direction (for sliding pieces)
      } else if (targetPiece.color !== color) {
        possibleMoves.push({ x, y }); // Capture opponent piece
        return false; // Stop, since we can't move beyond the captured piece
      } else {
        return false; // Friendly piece, block movement
      }
    }
    return false; // Out of bounds, stop
  };

  switch (type) {
    case PieceType.BISHOP:
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y + i)) break; // Diagonal right-down
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y - i)) break; // Diagonal left-up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y - i)) break; // Diagonal right-up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y + i)) break; // Diagonal left-down
      }
      break;

    case PieceType.KING:
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) addMove(position.x + dx, position.y + dy);
        }
      }
      break;

    case PieceType.KNIGHT:
      const knightMoves = [
        { dx: 2, dy: 1 },
        { dx: 2, dy: -1 },
        { dx: -2, dy: 1 },
        { dx: -2, dy: -1 },
        { dx: 1, dy: 2 },
        { dx: 1, dy: -2 },
        { dx: -1, dy: 2 },
        { dx: -1, dy: -2 },
      ];
      knightMoves.forEach((move) =>
        addMove(position.x + move.dx, position.y + move.dy)
      );
      break;

    case PieceType.PAWN:
      const direction = color === Color.WHITE ? -1 : 1; // White moves up (-1), Black moves down (+1)

      // Move forward if square is empty
      if (!board[position.x + direction][position.y]) {
        addMove(position.x + direction, position.y); // Move forward one square

        // Double move from starting position
        if (
          (color === Color.WHITE && position.x === 6) ||
          (color === Color.BLACK && position.x === 1)
        ) {
          if (!board[position.x + 2 * direction][position.y]) {
            addMove(position.x + 2 * direction, position.y); // Double move
          }
        }
      }

      // Pawn diagonal capture
      if (
        board[position.x + direction][position.y - 1] &&
        board[position.x + direction][position.y - 1]?.color !== color
      )
        addMove(position.x + direction, position.y - 1); // Capture left

      if (
        board[position.x + direction][position.y + 1] &&
        board[position.x + direction][position.y + 1]?.color !== color
      )
        addMove(position.x + direction, position.y + 1); // Capture right
      break;

    case PieceType.QUEEN:
      // Queen moves like both Rook and Bishop
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y)) break; // Down
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y)) break; // Up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x, position.y + i)) break; // Right
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x, position.y - i)) break; // Left
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y + i)) break; // Diagonal right-down
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y - i)) break; // Diagonal left-up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y - i)) break; // Diagonal right-up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y + i)) break; // Diagonal left-down
      }
      break;

    case PieceType.ROOK:
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x + i, position.y)) break; // Down
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x - i, position.y)) break; // Up
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x, position.y + i)) break; // Right
      }
      for (let i = 1; i < 8; i++) {
        if (!addMove(position.x, position.y - i)) break; // Left
      }
      break;

    default:
      break;
  }

  return possibleMoves;
};
