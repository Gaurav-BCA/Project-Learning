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