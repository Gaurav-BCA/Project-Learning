/* ==========================================================================
   YOUR ORIGINAL CODE (Commented out for reference & learning)
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
newGameBtn.addEventListener("click", resetGame);
========================================================================== */


// ==========================================================================
// IMPROVED VERSION (Using your exact variable & function names for easy learning)
// ==========================================================================

// 1. SELECT DOM ELEMENTS (Same names as yours)
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelectorAll(".reset-btn");
let result = document.querySelector(".result");
let msg = document.querySelector("#msg");

// 2. WINNING PATTERNS (Same coordinates as yours)
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

// 3. GAME STATE VARIABLES
let turnX = true;      // Tracks whose turn it is: true = 'X', false = 'O'
let count = 0;         // Tracks number of moves (up to 9)
let isGameOver = false; // Flag to prevent further clicks once a winner is found

// IMPROVEMENT: Store the board state in a JavaScript array.
// This is faster and cleaner than reading text directly from HTML elements!
let boardState = ["", "", "", "", "", "", "", "", ""];

// 4. CLICK EVENT LISTENER FOR EACH BOX
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        // Guard clause: ignore clicks if game is over or cell is already filled
        if (isGameOver || boardState[index] !== "") {
            return;
        }

        // Determine current player
        let currentPlayer = turnX ? "X" : "O";

        // Save move into our JavaScript array
        boardState[index] = currentPlayer;

        // Render to screen
        box.innerText = currentPlayer;

        // IMPROVEMENT: Use CSS classes instead of inline styles.
        // This keeps styling inside CSS and makes resetting completely clean.
        if (turnX) {
            box.classList.add("x-player");
            turnX = false; // Next turn is O
        } else {
            box.classList.add("o-player");
            turnX = true;  // Next turn is X
        }

        box.disabled = true;
        count++;

        // Check if this move won the game or resulted in a draw
        checkWinner();
    });
});

// 5. CHECK WINNER FUNCTION (Same name as yours)
const checkWinner = () => {
    for (let pattern of winPatterns) {
        // Read values from our boardState array instead of reading the DOM
        let pos1Val = boardState[pattern[0]];
        let pos2Val = boardState[pattern[1]];
        let pos3Val = boardState[pattern[2]];

        // If all 3 cells are filled and match each other
        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            isGameOver = true;

            // IMPROVEMENT: Highlight the 3 winning boxes visually
            boxes[pattern[0]].classList.add("winner-box");
            boxes[pattern[1]].classList.add("winner-box");
            boxes[pattern[2]].classList.add("winner-box");

            // Display winner announcement
            msg.innerText = `Winner is ${pos1Val}! 🎉`;
            result.classList.remove("hide");

            disableBoxes();
            return;
        }
    }

    // Check for draw (all 9 boxes filled with no winner)
    if (count === 9) {
        isGameOver = true;
        msg.innerText = `It's a draw! 🤝`;
        result.classList.remove("hide");
    }
};

// 6. DISABLE BOXES (Same name as yours)
const disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

// 7. ENABLE BOXES (Same name as yours)
const enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
    });
};

// 8. RESET GAME FUNCTION (Same name as yours)
const resetGame = () => {
    turnX = true;
    count = 0;
    isGameOver = false;

    // Reset JavaScript array state
    boardState = ["", "", "", "", "", "", "", "", ""];

    // Clear UI text and remove added classes
    boxes.forEach((box) => {
        box.innerText = "";
        box.classList.remove("x-player", "o-player", "winner-box");
    });

    enableBoxes();
    result.classList.add("hide");
};

// 9. ATTACH RESET LISTENERS (Same as yours)
resetBtn.forEach((btn) => {
    btn.addEventListener("click", resetGame);
});
