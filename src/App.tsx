import Chessboard from "./components/Chessboard";
import "./App.css";
import { FunctionComponent } from "react";
import { useAppSelector } from "./redux/hooks";

const App: FunctionComponent = () => {
  const board = useAppSelector((state) => state.chessBoard);
  return (
    <div className="App">
      <Chessboard board={board} />
    </div>
  );
};

export default App;
