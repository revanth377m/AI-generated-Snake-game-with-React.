import React, { useEffect, useRef, useState, useCallback } from 'react';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const GAME_SPEED = 100; // ms per frame

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const gameState = useRef({
    snake: [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ],
    food: { x: 15, y: 5 },
    direction: { dx: 0, dy: -1 },
    nextDirection: { dx: 0, dy: -1 },
  });

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    gameState.current = {
      snake: [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
      ],
      food: generateFood([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]),
      direction: { dx: 0, dy: -1 },
      nextDirection: { dx: 0, dy: -1 },
    };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        if (gameOver) resetGame();
        else setIsPaused((p) => !p);
        return;
      }

      const { direction } = gameState.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.dy === 0) gameState.current.nextDirection = { dx: 0, dy: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.dy === 0) gameState.current.nextDirection = { dx: 0, dy: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.dx === 0) gameState.current.nextDirection = { dx: -1, dy: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.dx === 0) gameState.current.nextDirection = { dx: 1, dy: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      const state = gameState.current;
      state.direction = state.nextDirection;
      
      const head = state.snake[0];
      const newHead = {
        x: head.x + state.direction.dx,
        y: head.y + state.direction.dy,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      if (state.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...state.snake];

      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        setScore((s) => {
          const newScore = s + 10;
          setHighScore((hs) => Math.max(hs, newScore));
          return newScore;
        });
        state.food = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      state.snake = newSnake;
    };

    const gameLoop = setInterval(() => {
      moveSnake();
      drawGame();
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [hasStarted, isPaused, gameOver, generateFood]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameState.current;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Subtle grid
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food (Magenta)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f0f';
    ctx.fillStyle = '#f0f';
    
    ctx.fillRect(
      state.food.x * CELL_SIZE + 2, 
      state.food.y * CELL_SIZE + 2, 
      CELL_SIZE - 4, 
      CELL_SIZE - 4
    );

    // Draw snake (Cyan)
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
    
    state.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#0ff' : '#088';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[400px]">
      
      {/* Header Box */}
      <div className="border-2 border-[#6082B6] p-2 w-full bg-black">
        <div className="h-12 bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2"></div>
        <div className="text-center text-cyan-400 font-mono text-sm tracking-[0.2em]">
          CYBERNETIC BEATS EDITION
        </div>
      </div>

      {/* Score Box */}
      <div className="border-2 border-[#6082B6] p-3 w-full flex justify-between items-center bg-black">
        <div className="flex flex-col">
          <span className="text-cyan-600 text-[10px] font-sans">SCORE</span>
          <span className="text-2xl font-bold text-cyan-400 font-sans">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        
        <div className="text-white text-xl font-bold font-mono glitch tracking-widest" data-text="NIGHTXCRAWLER">
          NIGHTXCRAWLER
        </div>

        <div className="flex flex-col items-end">
          <span className="text-fuchsia-600 text-[10px] font-sans">HIGH SCORE</span>
          <span className="text-2xl font-bold text-fuchsia-400 font-sans">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Canvas Box */}
      <div className="p-1 rounded bg-gradient-to-br from-cyan-500/40 to-fuchsia-500/40 w-full relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-[#050505] w-full block"
        />
        
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-1 bg-black/80 flex flex-col items-center justify-center text-center p-6 z-10">
            {!hasStarted ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-2 font-mono glitch" data-text="SYSTEM.READY">SYSTEM.READY</h2>
                <p className="text-cyan-400 mb-6 font-sans text-lg">AWAITING INPUT</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors font-sans text-xl font-bold uppercase"
                >
                  INITIALIZE
                </button>
              </>
            ) : gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-fuchsia-500 mb-4 font-sans glitch" data-text="GAME OVER">GAME OVER</h2>
                <p className="text-white mb-8 font-sans text-xl">Final Score: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-[#300030] border-2 border-fuchsia-500 text-white hover:bg-fuchsia-500 hover:text-black transition-colors font-sans text-xl font-bold uppercase shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                >
                  PLAY AGAIN
                </button>
              </>
            ) : isPaused ? (
              <>
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 font-sans glitch" data-text="PAUSED">PAUSED</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-3 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors font-sans text-xl font-bold uppercase"
                >
                  RESUME
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="text-gray-500 text-sm font-sans tracking-widest uppercase mt-2">
        PRESS <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 mx-1">SPACE</kbd> TO PAUSE
      </div>
    </div>
  );
}
