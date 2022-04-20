import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { DELAY_TIME, GRID_SIZE, HEAD_VISIBLE } from "../constants";

export enum CellType {
  EMPTY,
  FOOD,
  TAIL,
  HEAD,
}

export interface Coordinate {
  posX: number;
  posY: number;
}

type Direction = "up" | "left" | "right" | "down";

interface GameStateType {
  cells: CellType[][];
  snake: Coordinate[];
  head: Coordinate | null;
  food: Coordinate | null;
  isPlaying: boolean;
  highScore: number;
  score: number;
  dir: Direction;
  interval: number;
}

const initialState: GameStateType = {
  cells: Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(CellType.EMPTY)),
  snake: [{ posX: Math.floor(GRID_SIZE / 2), posY: Math.floor(GRID_SIZE / 2) }],
  head: null,
  isPlaying: true,
  highScore: Number(localStorage.getItem("highScore")) ?? 0,
  dir: "up",
  interval: -1,
  food: null,
  score: 1,
};

const reducer = (state: GameStateType, action: any) => {
  switch (action.type) {
    case "RESET":
      return { ...initialState, highScore: state.highScore };
    case "SET_INTERVAL":
      return {
        ...state,
        interval: action.payload,
      };
    case "CHANGE_DIR":
      // do not allow snake to turn back on itself
      if (
        (state.dir === "up" && action.payload === "down") ||
        (state.dir === "down" && action.payload === "up") ||
        (state.dir === "left" && action.payload === "right") ||
        (state.dir === "right" && action.payload === "left")
      ) {
        return state;
      }

      return {
        ...state,
        dir: action.payload as Direction,
      };
    case "MOVE_SNAKE":
      if (state.snake.length < 1) {
        throw Error;
      }
      let newHead: Coordinate;
      const head = state.snake[0];

      switch (state.dir) {
        case "up":
          newHead = { ...head, posY: head.posY - 1 };
          break;
        case "down":
          newHead = { ...head, posY: head.posY + 1 };
          break;
        case "left":
          newHead = { ...head, posX: head.posX - 1 };
          break;
        case "right":
          newHead = { ...head, posX: head.posX + 1 };
          break;
      }

      const shouldDie = () => {
        const eatsItself = state.snake.slice(1).some((cell) => {
          return cell.posX === head.posX && cell.posY === head.posY;
        });
        const outOfArea =
          head.posX < 0 ||
          head.posX >= GRID_SIZE ||
          head.posY < 0 ||
          head.posY >= GRID_SIZE;
        return eatsItself || outOfArea;
      };

      if (shouldDie()) {
        clearInterval(state.interval);
        const highscore = Math.max(state.highScore, state.score);
        localStorage.setItem("highScore", highscore.toString());

        return {
          ...state,
          interval: -1,
          isPlaying: false,
          highScore: highscore,
        };
      }
      const shouldGrow: boolean =
        !!state.food &&
        newHead.posX === state.food.posX &&
        newHead.posY === state.food.posY;

      // if no food exist create a random food on the map
      let foodCoord: Coordinate;
      do {
        foodCoord = state.food
          ? state.food
          : {
              posX: Math.floor(Math.random() * GRID_SIZE),
              posY: Math.floor(Math.random() * GRID_SIZE),
            };
      } while (
        state.snake.some(
          (v) => v.posX === foodCoord.posX && v.posY === foodCoord.posY
        )
      );

      const newSnake: Coordinate[] = [];
      newSnake.push(newHead);

      for (let i = 0; i < state.snake.length; i++) {
        if (i === state.snake.length - 1) {
          if (shouldGrow) {
            newSnake.push(state.snake[i]);
          }
        } else {
          newSnake.push(state.snake[i]);
        }
      }

      let newCells: CellType[][] = Array(GRID_SIZE).fill(
        Array(GRID_SIZE).fill(CellType.EMPTY)
      );

      newCells = newCells.map((r, y) => {
        return r.map((c, x) => {
          if (
            HEAD_VISIBLE &&
            state.head &&
            x === state.head.posX &&
            y === state.head.posY
          ) {
            return CellType.HEAD;
          } else if (state.snake.some((v) => v.posX === x && v.posY === y)) {
            return CellType.TAIL;
          } else if (
            state.food &&
            x === state.food.posX &&
            state.food.posY === y
          ) {
            return CellType.FOOD;
          } else {
            return CellType.EMPTY;
          }
        });
      });

      return {
        ...state,
        snake: newSnake,
        head: newHead,
        cells: newCells,
        food: shouldGrow ? null : foodCoord,
        score: shouldGrow ? state.score + 1 : state.score,
      };
  }
  return state;
};

export interface GameContextType {
  state: GameStateType;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.isPlaying) {
      const interval = setInterval(() => {
        dispatch({ type: "SET_INTERVAL", payload: interval });
        dispatch({ type: "MOVE_SNAKE" });
      }, DELAY_TIME);

      return () => {
        clearInterval(interval);
      };
    }
  }, [state.isPlaying]);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      e.preventDefault();
      let dir: Direction = "up";
      if (e.key === "ArrowDown") {
        dir = "down";
      } else if (e.key === "ArrowRight") {
        dir = "right";
      } else if (e.key === "ArrowUp") {
        dir = "up";
      } else if (e.key === "ArrowLeft") {
        dir = "left";
      } else if (e.key === "ArrowDown") {
        dir = "down";
      }
      dispatch({ type: "CHANGE_DIR", payload: dir });
    };

    window.addEventListener("keydown", eventHandler, false);

    return () => {
      window.removeEventListener("keydown", eventHandler, false);
    };
  }, []);

  const resetGame = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <GameContext.Provider value={{ state, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  return useContext(GameContext);
};

export default useGame;
