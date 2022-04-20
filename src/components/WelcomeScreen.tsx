import Button from "./shared/Button";
import snake from "../assets/snake.svg";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="py-10">
        <h1 className="text-4xl text-center font-thin">
          Welcome to the <br />
          <span className="text-5xl font-semibold text-red-600">
            React Snake Game
          </span>
        </h1>
      </div>
      <div className="w-2/5 mx-auto">
        <img src={snake} />
      </div>

      <div className="flex items-center justify-center p-5">
        <Button
          className="mr-3"
          text="Start the Game"
          isPrimary
          onClick={() => navigate("play")}
        />
        <a href="https://github.com/CGRDMZ/react-snake-game" rel="noopener noreferrer" target="_blank">
          <Button text="Check Source" />
        </a>
      </div>
      <div className="w-full bg-green-600 p-1 absolute bottom-0 ">
        <p className="text-center text-md font-light">
          Built with 🐍 by{" "}
          <a className="font-normal" href="https://github.com/CGRDMZ" rel="noopener noreferrer" target="_blank">
            CGRDMZ
          </a>
        </p>
      </div>
    </>
  );
};

export default WelcomeScreen;
