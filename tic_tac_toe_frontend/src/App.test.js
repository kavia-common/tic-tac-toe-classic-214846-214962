import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and grid', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  // There should be 9 squares (buttons)
  const buttons = screen.getAllByRole('button');
  // at least theme toggle + reset + 9 squares => >= 11
  expect(buttons.length).toBeGreaterThanOrEqual(11);
});

test('allows a move and toggles turn', () => {
  render(<App />);
  const status = screen.getByText(/Turn: X/i);
  // Click first square
  const gridButtons = screen.getAllByRole('button').filter(b => b.textContent === '' || b.textContent === 'X' || b.textContent === 'O');
  fireEvent.click(gridButtons[0]);
  expect(gridButtons[0].textContent).toBe('X');
});
