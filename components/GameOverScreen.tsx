
import React from 'react';
import type { GameState } from '../types';

interface GameOverScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ gameState, onRestart }) => {
  const isWin = gameState.gameWon;
  const title = isWin ? "پیروزی!" : "شما نابود شدید";
  const titleColor = isWin ? "text-amber-400" : "text-red-500";
  const buttonColor = isWin ? "bg-amber-600 hover:bg-amber-500" : "bg-red-700 hover:bg-red-600";

  return (
    <div className="flex flex-col items-center justify-center text-center bg-black/50 p-8 rounded-lg">
      <h1 className={`text-6xl font-title mb-4 ${titleColor}`}>{title}</h1>
      <p className="text-xl font-title text-gray-300 mb-8 max-w-3xl">
        {gameState.sceneDescription}
      </p>
      <button
        onClick={onRestart}
        className={`px-8 py-3 text-white font-bold text-lg rounded-lg transition-colors transform hover:scale-105 ${buttonColor}`}
      >
        دوباره بازی کن
      </button>
    </div>
  );
};

export default GameOverScreen;