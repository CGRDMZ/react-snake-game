import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { GRID_SIZE } from "../constants";

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

interface GameContextType {
  cells: CellType[][];
  snake: Coordinate[];
  food: Coordinate | null;
  isPlaying: boolean;
  highScore: number;
  dir: Direction;
  interval: number;
}

const initialState: GameContextType = {
  cells: Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(CellType.EMPTY)),
  snake: [{ posX: 5, posY: 5 }],
  isPlaying: true,
  highScore: Number(localStorage.getItem("highScore")) ?? 0,
  dir: "up",
  interval: -1,
  food: null
};

const reducer = (state: GameContextType, action: any) => {
  switch (action.type) {
    case "SET_INTERVAL":
      return {
        ...state,
        interval: action.payload,
      }
    case "CHANGE_DIR":
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
              
              if (
                newHead.posX < -1 ||
                newHead.posX >= GRID_SIZE + 1 ||
                newHead.posY < -1 ||
                newHead.posY >= GRID_SIZE + 1
                ) {
        clearInterval(state.interval);
        return {
          ...state,
          isPlaying: false,
        };
      }
      const shouldGrow: boolean = !!state.food && newHead.posX === state.food.posX && newHead.posY === state.food.posY;

      // if no food exist create a random food on the map
      let foodCoord: Coordinate = state.food ? state.food : {
        posX: Math.floor(Math.random() * GRID_SIZE),
        posY: Math.floor(Math.random() * GRID_SIZE),
      }

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
          if (state.snake.some((v) => v.posX === x && v.posY === y)) {
            return CellType.TAIL;
          } else if (state.food && x === state.food.posX && state.food.posY === y) {
            return CellType.FOOD;
          } else {
            return CellType.EMPTY;
          }
        });
      });

      return {
        ...state,
        snake: newSnake,
        cells: newCells,
        food: shouldGrow ? null : foodCoord,
      };
  }
  return state;
};

const GameContext = createContext<GameContextType>(initialState);

export const GameContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("tick");

      dispatch({type: "SET_INTERVAL", payload: interval});
      dispatch({ type: "MOVE_SNAKE" });
    }, 1000);




    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
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

  return <GameContext.Provider value={state}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  return useContext(GameContext);
};

export default useGame;
