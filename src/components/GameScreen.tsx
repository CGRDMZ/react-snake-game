import { FC } from "react";
import cls from "classnames";
import useGame, {
  CellType,
  GameContextProvider,
} from "../contexts/GameContext";
import { GRID_SIZE } from "../constants";
import Button from "./shared/Button";

const Cell: FC<{ type: CellType }> = ({ type }) => {
  let cellStyle = "";
  switch (type) {
    case CellType.EMPTY:
      cellStyle = "bg-white";
      break;
    case CellType.FOOD:
      cellStyle = "bg-yellow-500";
      break;
    case CellType.TAIL:
      cellStyle = "bg-green-600";
      break;
    case CellType.HEAD:
      cellStyle = "bg-red-500";
      break;
    default:
      throw Error("not existing cell type.");
  }
  return <div className={cls("aspect-square", cellStyle)}></div>;
};

const CellWrapper: FC = () => {
  const {
    state: { cells, isPlaying },
  } = useGame();
  return (
    <div
      className={`grid mt-6 relative`}
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
    >
      {cells.map((y, i) =>
        y.map((x, j) => <Cell key={i * y.length + j} type={x} />)
      )}
      {!isPlaying && <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"><p className="text-3xl">Try Again!</p></div>}
    </div>
    
  );
};

const GameArea: FC = () => {
  const {
    state: { dir, score, highScore },
    resetGame,
  } = useGame();
  return (
    <>
      <CellWrapper />
      <div className="w-full flex justify-between items-center py-4 text-center ">
        <div className="flex-1">
          <p>Score: <span>{score}</span></p>
        </div>
        <div className="flex-1">
          <p>High Score: <span>{highScore}</span></p>
        </div>
        <div className="flex-1">
          <p>Direction: <span>{dir}</span></p>
        </div>
        <div className="flex-1">
          <Button text="Reset Game" isPrimary onClick={() => resetGame() } />
        </div>
      </div>
    </>
  );
};

const GameScreen: FC<{}> = () => {
  return (
    <GameContextProvider>
      <div className="w-4/5 mx-auto">
        <GameArea />
      </div>
    </GameContextProvider>
  );
};

export default GameScreen;
