import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

/**
 * Square component: renders an individual cell in the Tic Tac Toe grid.
 * Highlights if part of the winning line and is disabled when game is over.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-square--highlight' : ''}`}
      onClick={onClick}
      aria-label={`Grid cell ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
 * Board component: renders a 3x3 grid of Square components.
 */
function Board({ squares, onSquareClick, winningLine }) {
  const renderSquare = (i) => {
    const isWinning = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinning}
      />
    );
  };

  return (
    <div className="ttt-grid" role="grid" aria-label="Tic Tac Toe board">
      {Array.from({ length: 9 }, (_, idx) => renderSquare(idx))}
    </div>
  );
}

/**
 * Calculates the winner of the Tic Tac Toe board along with the winning line.
 * Returns { winner: 'X' | 'O' | null, line: number[] | null }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /** Theme handling preserved from template for modern look toggle */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  /** Game state */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isBoardFull = useMemo(() => squares.every(Boolean), [squares]);
  const isDraw = !winner && isBoardFull;

  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleSquareClick = (i) => {
    if (squares[i] || winner) return; // Ignore if filled or game over
    const next = squares.slice();
    next[i] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw!'
    : `Turn: ${currentPlayer}`;

  return (
    <div className="App">
      <main className="game-container">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <section className="game-card" aria-live="polite">
          <h1 className="game-title">Tic Tac Toe</h1>

          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            winningLine={winningLine}
          />

          <div className="game-info">
            <div
              className={`status-badge ${
                winner ? 'status-badge--success' : isDraw ? 'status-badge--secondary' : 'status-badge--primary'
              }`}
            >
              {statusText}
            </div>

            <div className="controls">
              <button className="btn btn-primary" onClick={resetGame}>
                Reset / New Game
              </button>
            </div>
          </div>

          <footer className="legend">
            <span className="dot dot--x" aria-hidden="true" /> X
            <span className="dot dot--o" aria-hidden="true" /> O
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
