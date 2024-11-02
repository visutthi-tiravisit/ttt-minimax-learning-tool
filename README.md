# Tic-Tac-Toe with AI

A web-based Tic-Tac-Toe game where a human player competes against an AI. The AI uses the Minimax algorithm to calculate the best possible moves and play strategically.

For Demo: https://ttt-minimax.web.app/

## Features

- **Player vs AI**: The human plays as "X" and the AI as "O".
- **AI Strategy**: The AI leverages the Minimax algorithm for optimal moves.
- **Real-time move scoring**: The AI displays scores for potential moves.
- **Interactive UI**: Visual cues highlight moves and show game status messages.
- **Game Control**: Includes a restart button to reset the game board.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/visutthi-tiravisit/ttt-minimax-learning-tool.git
   cd ttt-minimax-learning-tool
   ```
2. Open index.html in your preferred web browser to start the game.

### How to Play

1. The human player clicks a cell to place "X".
2. After each move, the AI calculates and displays its best response as "O".
3. The game announces the winner, draw, or game over when appropriate.

### Project Structure
- index.html - HTML file for the game layout.
- style.css - Basic styling for the Tic-Tac-Toe board and elements.
- app.js - Contains the game logic and AI decision-making.

### Function Overview
The main functions and their roles:

- evalute(state): Evaluates the board and returns a score.
- gameOver(state, player): Checks if the specified player has won.
- gameOverAll(state): Checks if the game is over for any reason.
- emptyCells(state): Returns a list of available moves.
- validMove(x, y): Verifies if a move is valid.
- setMove(x, y, player): Places a move on the board.
- minimax(state, depth, player, isAiTurn): Minimax algorithm for best move.
- aiTurn(): Executes the AI's move on the board.
- triggerAiMove(): Triggers the AI's turn and updates the UI.
- disableBoard(), enableBoard(): Controls board interactivity.
- clickedCell(cell): Handles user moves.
- checkGameOver(): Displays the result if the game has ended.
- restartBnt(button): Resets the game for a new round.
