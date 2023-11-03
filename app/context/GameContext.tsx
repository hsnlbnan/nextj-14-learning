// GameContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

type GameContextType = {
  time: number;
  startTime: () => void;
  stopTime: () => void;
  resetTimer: () => void;
  name: string;
  modal: boolean;
  setModal: (value: boolean) => void;
  handleName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setWrongGuesses: (value: number) => void;
  score: number;
};

const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [modal, setModal] = useState<boolean>(false);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);

  let point = 1000;

  const score =
    wrongGuesses === 0
      ? point - time / 1000
      : point - (time / 1000) * (1 / wrongGuesses);

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTime = () => setIsRunning(true);

  const stopTime = () => setIsRunning(false);

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <GameContext.Provider
      value={{
        time,
        startTime,
        stopTime,
        resetTimer,
        name,
        modal,
        setModal,
        handleName,
        setWrongGuesses,
        score,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
