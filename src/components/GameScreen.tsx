import { FC } from "react";
import cls from "classnames";
import useGame, { CellType, GameContextProvider } from "../contexts/GameContext";
import { GRID_SIZE } from "../constants";

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
  const { cells } = useGame();
  return (
    <div className={`grid grid-cols-[repeat(10,_1fr)]`}>
      {cells.map((y, i) => y.map((x, j) => <Cell key={i * y.length + j} type={x} />))}
    </div>
  );
};

const GameArea: FC = () => {
  const {dir} = useGame();
  return <><CellWrapper />{dir}</>
}

const GameScreen: FC<{}> = () => {
  
  return (
    <GameContextProvider>
      <div className="w-10/12 ">
        <GameArea />
      </div>
    </GameContextProvider>
  );
};

export default GameScreen;
