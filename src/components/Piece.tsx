import { FunctionComponent } from "react";
import { PieceType, Color } from "../classes";

type PieceProps = {
  type: PieceType;
  color: Color;
};

const Piece: FunctionComponent<PieceProps> = ({ type, color }) => {
  return <div className={`piece ${color}`}>{type}</div>;
};

export default Piece;
