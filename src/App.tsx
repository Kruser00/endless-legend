import React, { useState, useCallback } from 'react';
import type { GameState } from './types';
import { generateGameState, generateImage } from './services/geminiService';
import SceneDisplay from './components/SceneDisplay';
import ActionPanel from './components/ActionPanel';
import LoadingSpinner from './components/LoadingSpinner';
import GameOverScreen from './components/GameOverScreen';
import InventoryPanel from './components/InventoryPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGameState(null);
    setCurrentImage(null);
    setHistory([]);
    setGameStarted(true);
    setIsInventoryOpen(false);

    try {
      const initialGameState = await generateGameState("START_GAME");
      setGameState(initialGameState);
      
      if (initialGameState.generateImage) {
        const image = await generateImage(initialGameState.imagePrompt);
        setCurrentImage(image);
      }
    } catch (err) {
      console.error(err);
      setError("شروع ماجراجویی با شکست مواجه شد. ارواح یاری نمی‌کنند. لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAction = useCallback(async (action: string) => {
    if (!gameState || isLoading) return;

    setIsLoading(true);
    setError(null);

    const previousSceneDescription = gameState.sceneDescription;
    const previousStatus = gameState.characterStatus;
    setHistory(prev => [...prev, `> ${action}`, `(${previousStatus})`, `\n${previousSceneDescription}\n`]);

    try {
      const nextGameState = await generateGameState(action, gameState);
      setGameState(nextGameState);

      if (nextGameState.gameOver || nextGameState.gameWon) {
        // Keep the last image for the game over screen
      } else if (nextGameState.generateImage) {
        setCurrentImage(null); // Clear previous image while new one loads
        const image = await generateImage(nextGameState.imagePrompt);
        setCurrentImage(image);
      }
      
    } catch (err)
 {
      console.error(err);
      setError("نیرویی مرموز مانع از اقدام شما می‌شود. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  }, [gameState, isLoading]);

  const renderContent = () => {
    if (isLoading && !gameState) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <LoadingSpinner />
          <p className="text-xl font-bold text-gray-400 animate-pulse">ماجراجویی شما در حال شکل‌گیری است...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      );
    }

    if (gameState?.gameOver || gameState?.gameWon) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GameOverScreen gameState={gameState} onRestart={startGame} />
        </div>
      );
    }

    if (gameState) {
      return (
        <div className="flex flex-col md:flex-row w-full md:h-full md:gap-6 lg:gap-8">
          <div className="md:w-2/3 md:h-full">
            <SceneDisplay image={currentImage} description={gameState.sceneDescription} isLoading={isLoading && gameState.generateImage && currentImage === null}/>
          </div>
          <div className="md:w-1/3 md:h-full">
            <ActionPanel
              health={gameState.health}
              status={gameState.characterStatus}
              actions={gameState.actions}
              onAction={handleAction}
              disabled={isLoading}
              history={history}
              recap={gameState.storyRecap}
              onToggleInventory={() => setIsInventoryOpen(true)}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900">
        <div className="text-center">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-4">افسانه بی‌پایان</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">یک ماجراجویی متنی بی‌پایان با قدرت هوش مصنوعی. هر انتخاب، مسیری تازه در دنیایی از فانتزی تاریک می‌تراشد. هیچ دو سفری یکسان نخواهد بود.</p>
            <button
                onClick={startGame}
                className="px-8 py-3 text-lg sm:px-10 sm:py-4 sm:text-xl bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-amber-600/30"
            >
                سفر خود را آغاز کنید
            </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-900">
       <InventoryPanel 
        isOpen={isInventoryOpen} 
        onClose={() => setIsInventoryOpen(false)}
        inventory={gameState?.inventory ?? []}
      />
      <div className="max-w-7xl mx-auto md:h-screen md:p-4 lg:p-8 md:flex md:items-center">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;