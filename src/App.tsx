import Chessboard from "./components/Chessboard";
import "./App.css";
import { FunctionComponent } from "react";
import { useAppSelector } from "./redux/hooks";

const App: FunctionComponent = () => {
  const gameState = useAppSelector((state) => state.game);
  return (
    <div className="App">
      <Chessboard board={gameState.board} />
    </div>
  );
};

export default App;
