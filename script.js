var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

var HUMAN = -1; // Min // X
var COMP = +1; // Max // O
var aiBestMove = null; // To display forecast decision

// evalute returns 1 if AI wins, -1 if human wins, or 0 for a draw or non-terminal state.
function evalute(state) { 
    if (gameOver(state, COMP)) return 1; // AI wins
    else if (gameOver(state, HUMAN)) return -1; // Human wins
    else return 0; // Draw or non-terminal state
}

// gameOver determines if a given player has won by checking all possible win conditions (rows, columns, and diagonals).
function gameOver(state, player) { 
    var win_state = [
        [state[0][0], state[0][1], state[0][2]],
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]],
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]],
        [state[2][0], state[1][1], state[0][2]],
    ];

    for (var i = 0; i < 8; i++) {
        var line = win_state[i];
        var filled = 0;
        for (var j = 0; j < 3; j++) {
            if (line[j] == player)
                filled++;
        }
        if (filled == 3)
            return true;
    }
    return false;
}

// gameOverAll checks if the game has ended for either player or if there are no moves left.
function gameOverAll(state) { 
    return gameOver(state, HUMAN) || gameOver(state, COMP) || emptyCells(state).length === 0;
}

// emptyCells returns a list of all empty cells on the board, allowing the AI to know where it can make a move.
function emptyCells(state) { 
    var cells = [];
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (state[x][y] == 0)
                cells.push([x, y]);
        }
    }
    return cells;
}

// validMove checks if a cell is empty before a move.
function validMove(x, y) { 
    var empties = emptyCells(board);
    try {
        if (board[x][y] == 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

// setMove places a move on the board if it’s valid, updating the board for the given player.
function setMove(x, y, player) { 
    if (validMove(x, y)) {
        board[x][y] = player;
        return true;
    }
    else {
        return false;
    }
}

// minimax is the recursive AI algorithm that finds the best move by evaluating possible moves.
function minimax(state, depth, player, isAiTurn) {
    let bestMove;

    // Initialize best move for maximizing or minimizing
    if (player === COMP) {
        bestMove = [-1, -1, -Infinity]; // AI maximizing
    } else {
        bestMove = [-1, -1, Infinity];  // User minimizing
    }

    // Base case: if game over or depth is 0, return evaluated score
    if (depth === 0 || gameOverAll(state)) {
        let score = evalute(state);
        return [-1, -1, score];
    }

    // Object to store final score for each cell (x, y)
    const finalScores = {};

    // Evaluate all possible moves
    emptyCells(state).forEach(function (cell) {
        let x = cell[0];
        let y = cell[1];
        
        state[x][y] = player;  // Make the move

        // Recursive call to minimax with depth - 1 and the opposite player
        let score = minimax(state, depth - 1, -player, !isAiTurn);

        // Undo the move to restore state for next iteration
        state[x][y] = 0;

        // Set move coordinates in the score result
        score[0] = x;
        score[1] = y;

        // Store the final calculated score for this move in finalScores
        finalScores[`${x}${y}`] = score[2];

        // Determine the best score based on maximizing or minimizing
        if (player === COMP) {
            if (score[2] > bestMove[2]) bestMove = score;
        } else {
            if (score[2] < bestMove[2]) bestMove = score;
        }
    });

    // Update the visualization after all moves are evaluated
    Object.keys(finalScores).forEach((key) => {
        const x = parseInt(key[0]);
        const y = parseInt(key[1]);
        const cellScore = finalScores[key];
        
        // Use finalScores to update only once after calculations are done
        if (isAiTurn) {
            document.getElementById(`ai-${x}${y}`).innerHTML = `${cellScore}`;
        }
    });

    return bestMove; // Return the best move found
}

// aiTurn executes the AI's best move on the board and updates the display.
function aiTurn() { 
    var x, y;
    var cell;

    if (aiBestMove) {
        var x = aiBestMove[0];
        var y = aiBestMove[1];

        if (setMove(x, y, COMP)) {
            var cell = document.getElementById(String(x) + String(y));
            const unavailablecell = document.getElementById(`ai-${cell.id}`);
            unavailablecell.style.backgroundColor = "gray"; // Highlight color
            cell.innerHTML = "O";
        }
    }
    aiBestMove = null;
}

// triggerAiMove initiates the AI move, checks the game state, and re-enables the board for the user.
function triggerAiMove() { 
    var aiButton = document.getElementById("bnt-ai-move");
    aiButton.disabled = true; // Disable "AI Move" button to prevent multiple clicks during AI's turn

    var conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0;
    if (conditionToContinue) {
        aiTurn();  // Call AI move function
        checkGameOver();  // Check if game is over after AI's move
        enableBoard(); // Re-enable the main board for human clicks
    }
}

// Disable all cells in the board
function disableBoard() { 
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var cell = document.getElementById(`${x}${y}`);
            cell.onclick = null; // Disable click events
            cell.style.pointerEvents = "none"; // Prevent clicking
        }
    }
}

// Enable all cells in the board
function enableBoard() {
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var cell = document.getElementById(`${x}${y}`);
            cell.onclick = function() { clickedCell(this); }; // Re-enable click events
            cell.style.pointerEvents = "auto"; // Allow clicking
        }
    }
}

// clickedCell handles user clicks on a cell, registers the move, and initiates the AI turn.
let ailastHighlightedCell = null;
function clickedCell(cell) { 
    if (!cell.onclick) return; // Prevent clicking if the cell is already disabled

    var button = document.getElementById("bnt-restart");
    var aiButton = document.getElementById("bnt-ai-move");
    button.disabled = true;

    var conditionToContinue = gameOverAll(board) == false && emptyCells(board).length > 0;

    if (conditionToContinue == true) {
        var x = cell.id.split("")[0];
        var y = cell.id.split("")[1];
        var move = setMove(x, y, HUMAN);
        if (move == true) {
            cell.innerHTML = "X";
            disableBoard(); // Disable the board after the human makes a move

            // Calculate AI's best move
            aiBestMove = minimax(board, emptyCells(board).length, COMP, true);
            console.log(`AI best move calculated: ${aiBestMove[0]}, ${aiBestMove[1]} with score ${aiBestMove[2]}`);
            if (ailastHighlightedCell) {
                ailastHighlightedCell.style.border = ""; // Reset border
            }
            const unavailablecell = document.getElementById(`ai-${cell.id}`);
            unavailablecell.style.backgroundColor = "gray"; // Highlight color
            const aiMoveElement = document.getElementById(`ai-${aiBestMove[0]}${aiBestMove[1]}`);
            aiMoveElement.style.border = "4px solid orange";
            ailastHighlightedCell = aiMoveElement;
        }
    }
    checkGameOver(); // Check if game is over after user's turn
    aiButton.disabled = false; // Enable "AI Move" button after user's turn
}

// checkGameOver displays the game result if there's a winner or a draw.
function checkGameOver() { 
    var msg = document.getElementById("message");
    if (gameOver(board, COMP)) {
        msg.innerHTML = "You lose!";
        document.getElementById("bnt-restart").disabled = false;
    } else if (gameOver(board, HUMAN)) {
        msg.innerHTML = "You win!";
        document.getElementById("bnt-restart").disabled = false;
    } else if (emptyCells(board).length <= 1) {
        msg.innerHTML = "Draw!";
        document.getElementById("bnt-restart").disabled = false;
    }
    if (gameOverAll(board) || emptyCells(board).length == 0) {
        document.getElementById("bnt-restart").disabled = false;
    }
}

// restartBnt resets the board and UI elements to start a new game.
function restartBnt(button) {
    if (button.value == "Restart") {
        var htmlBoard;
        var aiButton = document.getElementById("bnt-ai-move");

        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                board[x][y] = 0; // Reset board state
                htmlBoard = document.getElementById(String(x) + String(y));
                htmlBoard.style.color = "#444"; // Reset text color
                htmlBoard.innerHTML = ""; // Clear cell content

                // Also reset the AI board cells
                var aiBoardCell = document.getElementById(`ai-${x}${y}`);
                if (aiBoardCell) {
                    aiBoardCell.style.backgroundColor = ""; // Clear background color
                    aiBoardCell.innerHTML = ""; // Clear cell content
                }
            }
        }
        if (ailastHighlightedCell) {
            ailastHighlightedCell.style.border = ""; // Reset border
        }
        document.getElementById("message").innerHTML = ""; // Clear any messages
        button.disabled = false; // Enable the restart button again

        aiButton.disabled = true; // Ensure AI Move button is disabled at the start
        enableBoard(); // Re-enable the board for clicking again
    }
}
