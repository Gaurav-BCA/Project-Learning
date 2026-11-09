/* ==========================================================================
   YOUR ORIGINAL CODE (Kept for reference & learning)
   ==========================================================================

let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelectorAll(".reset-btn");
let result = document.querySelector(".result");
let msg = document.querySelector("#msg");
// let newGameBtn = document.querySelector("#new-game-btn")

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];
let turnX = true;
let count = 0;
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        console.log("Box was clicked");
        if (turnX) {
            box.style.color = "violet";
            box.innerText = "X";
            turnX = false;
        } else {
            box.style.color = "blue"
            box.innerText = "O";
            turnX = true;
        }
        box.disabled = true;
        count++;
        checkWinner();
    });
});

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("winner");
                result.classList.remove("hide");
                msg.innerText = `Winner is ${pos1Val}`;
                disableBoxes();
                return;
            }
        };

    };
    if (count === 9) {
        console.log("Draw");
        result.classList.remove("hide");
        msg.innerText = `It's a draw!`;
    };
};

const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
    });
};

const resetGame = () => {
    turnX = true;
    count = 0;
    boxes.forEach((box) => { box.innerText = "" });
    enableBoxes();
    result.classList.add("hide");
};
resetBtn.forEach((btn) => {btn.addEventListener("click", resetGame);});
// newGameBtn.addEventListener("click", resetGame);
========================================================================== */


// ==========================================================================
// ADVANCED GAME IMPLEMENTATION:
// 1. SCOREBOARD WITH localStorage (persists scores across browser refresh)
// 2. SINGLE PLAYER AI MODE (Easy Random & Unbeatable Minimax)
// 3. FAMILIAR VARIABLE & FUNCTION NAMES FOR EASY LEARNING
// ==========================================================================

// 1. SELECT DOM ELEMENTS
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelectorAll(".reset-btn");
let result = document.querySelector(".result");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#turn-indicator");
let modeBtns = document.querySelectorAll(".mode-btn");

// Scoreboard DOM Elements
let scoreXEl = document.querySelector("#score-x");
let scoreOEl = document.querySelector("#score-o");
let scoreTiesEl = document.querySelector("#score-ties");
let labelO = document.querySelector("#label-o");
let resetScoreBtn = document.querySelector("#reset-score-btn");

// 2. WINNING PATTERNS (The same 8 winning lines as your original code)
const winPatterns = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// 3. CORE GAME STATE
let turnX = true;                       // true = 'X' turn, false = 'O' turn
let count = 0;                          // Move counter (0 to 9)
let isGameOver = false;                  // Disables clicks when round finishes
let isAITurn = false;                    // Prevents human clicks during AI "thinking" delay
let boardState = ["", "", "", "", "", "", "", "", ""]; // 9-element array representing the board

// Game Modes: 'pvp' (2 Players), 'ai-easy' (Random), 'ai-hard' (Unbeatable Minimax)
let currentGameMode = "pvp";

// ==========================================================================
// FEATURE 1: SCOREBOARD WITH localStorage
// ==========================================================================
// localStorage lets you save key-value pairs right inside the user's browser.
// Even if they close or refresh the tab, their win streaks remain intact!
const STORAGE_KEY = "gaurav_tictactoe_scores";
let scores = { xWins: 0, oWins: 0, ties: 0 };

// Function to load scores from localStorage when the page loads
const loadScores = () => {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            // JSON.parse converts the saved string back into a JavaScript object
            scores = JSON.parse(saved);
        } catch (e) {
            console.error("Could not parse saved scores:", e);
        }
    }
    updateScoreUI();
};

// Function to save current scores to localStorage
const saveScores = () => {
    // localStorage can only store text (strings), so we convert our object using JSON.stringify
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    updateScoreUI();
};

// Function to update the scoreboard numbers on the screen
const updateScoreUI = () => {
    scoreXEl.innerText = scores.xWins;
    scoreOEl.innerText = scores.oWins;
    scoreTiesEl.innerText = scores.ties;
};

// Function to reset all scores back to zero
const resetScores = () => {
    scores = { xWins: 0, oWins: 0, ties: 0 };
    saveScores();
};

if (resetScoreBtn) {
    resetScoreBtn.addEventListener("click", resetScores);
}

// ==========================================================================
// FEATURE 2: GAME MODE SELECTOR (PvP vs Easy AI vs Hard AI)
// ==========================================================================
modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Highlight the clicked mode button
        modeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        currentGameMode = btn.getAttribute("data-mode");

        // Update score label for Player O / AI
        if (currentGameMode === "pvp") {
            labelO.innerText = "Player (O)";
        } else {
            labelO.innerText = "AI (O)";
        }

        // Restart board when switching modes
        resetGame();
    });
});

// Helper: updates the top turn indicator message
const updateTurnIndicator = () => {
    if (isGameOver) return;

    if (turnX) {
        turnIndicator.innerText = "Turn: Player (X)";
    } else {
        if (currentGameMode === "pvp") {
            turnIndicator.innerText = "Turn: Player (O)";
        } else {
            turnIndicator.innerText = "AI is thinking...";
        }
    }
};

// ==========================================================================
// 4. USER CLICK EVENT LISTENER
// ==========================================================================
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        // Ignore click if cell is full, game is over, or AI is currently "thinking"
        if (boardState[index] !== "" || isGameOver || isAITurn) {
            return;
        }

        // Execute Human Player move
        makeMove(index, turnX ? "X" : "O");

        // If game continues and we're in AI mode and it's now O's turn:
        if (!isGameOver && currentGameMode !== "pvp" && !turnX) {
            triggerAIMove();
        }
    });
});

// Helper: Places a marker on the board array and the screen
const makeMove = (index, player) => {
    boardState[index] = player;
    boxes[index].innerText = player;
    boxes[index].disabled = true;

    if (player === "X") {
        boxes[index].classList.add("x-player");
        turnX = false; // Next is O
    } else {
        boxes[index].classList.add("o-player");
        turnX = true;  // Next is X
    }

    count++;
    checkWinner();

    if (!isGameOver) {
        updateTurnIndicator();
    }
};

// ==========================================================================
// FEATURE 3: AI OPPONENT LOGIC (Easy vs Unbeatable Minimax)
// ==========================================================================

// Helper: Finds all empty squares available on any board array
const getAvailableSpots = (board) => {
    let emptySpots = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            emptySpots.push(i);
        }
    }
    return emptySpots;
};

// Helper: Checks if a player has won on a simulated board
const checkWinForPlayer = (board, player) => {
    for (let pattern of winPatterns) {
        if (board[pattern[0]] === player &&
            board[pattern[1]] === player &&
            board[pattern[2]] === player) {
            return true;
        }
    }
    return false;
};

// --------------------------------------------------------------------------
// EASY AI: Picks a random empty cell
// --------------------------------------------------------------------------
const getEasyAIMove = (board) => {
    let available = getAvailableSpots(board);
    let randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
};

// --------------------------------------------------------------------------
// UNBEATABLE AI: MINIMAX ALGORITHM
// --------------------------------------------------------------------------
// How it works:
// 1. It simulates every possible future move recursively.
// 2. Base scores: AI win = +10, Human win = -10, Tie = 0.
//    (Subtracting 'depth' favors winning faster or delaying defeat).
// 3. Maximizing player (AI) chooses the move with highest score.
// 4. Minimizing player (Human) chooses the move with lowest score.
// --------------------------------------------------------------------------
const minimax = (simulatedBoard, depth, isMaximizing) => {
    // 1. TERMINAL CHECKS (Base cases for recursion)
    if (checkWinForPlayer(simulatedBoard, "O")) {
        return { score: 10 - depth }; // AI wins
    }
    if (checkWinForPlayer(simulatedBoard, "X")) {
        return { score: depth - 10 }; // Human wins
    }

    let availableSpots = getAvailableSpots(simulatedBoard);
    if (availableSpots.length === 0) {
        return { score: 0 }; // Tie
    }

    // 2. RECURSIVE BRANCHING
    if (isMaximizing) {
        // AI's Turn: Maximize score
        let maxScore = -Infinity;
        let bestSpot = null;

        for (let spot of availableSpots) {
            simulatedBoard[spot] = "O"; // Simulate move
            let result = minimax(simulatedBoard, depth + 1, false);
            simulatedBoard[spot] = "";  // Backtrack (undo move)

            if (result.score > maxScore) {
                maxScore = result.score;
                bestSpot = spot;
            }
        }
        return { score: maxScore, spot: bestSpot };
    } else {
        // Human's Turn: Minimize AI's score
        let minScore = Infinity;
        let bestSpot = null;

        for (let spot of availableSpots) {
            simulatedBoard[spot] = "X"; // Simulate move
            let result = minimax(simulatedBoard, depth + 1, true);
            simulatedBoard[spot] = "";  // Backtrack (undo move)

            if (result.score < minScore) {
                minScore = result.score;
                bestSpot = spot;
            }
        }
        return { score: minScore, spot: bestSpot };
    }
};

// Trigger AI turn with a small natural delay (400ms) so it feels like thinking
const triggerAIMove = () => {
    isAITurn = true;
    updateTurnIndicator();

    setTimeout(() => {
        if (isGameOver) {
            isAITurn = false;
            return;
        }

        let chosenIndex;
        if (currentGameMode === "ai-easy") {
            chosenIndex = getEasyAIMove(boardState);
        } else {
            // Unbeatable: Call Minimax starting with AI (maximizing = true)
            let bestMove = minimax([...boardState], 0, true);
            chosenIndex = bestMove.spot;
        }

        if (chosenIndex !== undefined && chosenIndex !== null) {
            makeMove(chosenIndex, "O");
        }

        isAITurn = false;
    }, 400);
};

// ==========================================================================
// 5. CHECK WINNER FUNCTION (Same name as yours, enhanced with Scoreboard)
// ==========================================================================
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boardState[pattern[0]];
        let pos2Val = boardState[pattern[1]];
        let pos3Val = boardState[pattern[2]];

        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            isGameOver = true;

            // Highlight the 3 winning squares
            boxes[pattern[0]].classList.add("winner-box");
            boxes[pattern[1]].classList.add("winner-box");
            boxes[pattern[2]].classList.add("winner-box");

            // Update scoreboard in localStorage
            if (pos1Val === "X") {
                scores.xWins++;
                msg.innerText = "Player (X) Wins! 🎉";
            } else {
                scores.oWins++;
                msg.innerText = currentGameMode === "pvp" ? "Player (O) Wins! 🎉" : "AI (O) Wins! 🤖";
            }
            saveScores();

            result.classList.remove("hide");
            turnIndicator.innerText = "Game Over!";
            disableBoxes();
            return;
        }
    }

    // Check for draw
    if (count === 9) {
        isGameOver = true;
        scores.ties++;
        saveScores();

        msg.innerText = "It's a draw! 🤝";
        result.classList.remove("hide");
        turnIndicator.innerText = "Game Over!";
    }
};

// ==========================================================================
// 6. DISABLE & ENABLE BOXES (Same names as yours)
// ==========================================================================
const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
    });
};

// ==========================================================================
// 7. RESET GAME FUNCTION (Same name as yours)
// ==========================================================================
const resetGame = () => {
    turnX = true;
    count = 0;
    isGameOver = false;
    isAITurn = false;

    // Reset array state
    boardState = ["", "", "", "", "", "", "", "", ""];

    // Clear board boxes
    boxes.forEach((box) => {
        box.innerText = "";
        box.classList.remove("x-player", "o-player", "winner-box");
    });

    enableBoxes();
    result.classList.add("hide");
    updateTurnIndicator();
};

// Attach listeners for both "Reset Game" and "New Game" buttons
resetBtn.forEach((btn) => {
    btn.addEventListener("click", resetGame);
});

// Load saved scores when the page loads
loadScores();
updateTurnIndicator();
