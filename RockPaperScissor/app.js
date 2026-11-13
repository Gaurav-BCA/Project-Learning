let userScore = 0;
let compScore = 0;
let drawScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const drawScorePara = document.querySelector("#draw-score");
const allScoreBoxes = document.querySelectorAll(".score");

function highlightBox(result) {
    // 1. पहले सभी बॉक्स से पुराना हाइलाइट हटाएं
    allScoreBoxes.forEach((box) => {
        box.classList.remove("win-highlight", "draw-highlight");
    });

    // 2. जीतने वाले बॉक्स पर नया रंग लगाएं
    if (result === "win") {
        userScorePara.parentElement.classList.add("win-highlight");
    } else if (result === "lose") {
        compScorePara.parentElement.classList.add("win-highlight");
    } else if (result === "draw") {
        drawScorePara.parentElement.classList.add("draw-highlight");
    };
};

const showResult = (result, userChoice, compChoice) => {
    if (result === "draw") {
        drawScore++;
        drawScorePara.innerText = drawScore;
        msg.innerText = `Game Draw! You and Computer choose ${userChoice}`;
        msg.style.backgroundColor = "grey";
    } else if (result === "win") {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `You Win! Your ${userChoice} beats Computer's ${compChoice}`;
        msg.style.backgroundColor = "green";
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `You lose! Computer's ${compChoice} beats Your ${userChoice}`;
        msg.style.backgroundColor = "red";
    }
    highlightBox(result);
};

const genCompChoice = () => {
    const options = ["rock", "paper", "scissor"];
    const randomIndex = Math.floor(Math.random() * 3);
    return options[randomIndex];
};

const playGame = (userChoice) => {
    console.log(`User choice = ${userChoice}`);
    // Generayte Computer Choice
    const compChoice = genCompChoice();
    console.log(`Comp choice = ${compChoice}`);

    let result = "";
    if (userChoice === compChoice) {
        result = "draw";

    } else {
        if (userChoice === "rock") {
            result = compChoice === "scissor" ? "win" : "lose";
        } else if (userChoice === "paper") {
            result = compChoice === "rock" ? "win" : "lose";
        } else {
            result = compChoice === "paper" ? "win" : "lose";
        };
    };
    showResult(result, userChoice, compChoice);
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        console.log("you select!");
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});