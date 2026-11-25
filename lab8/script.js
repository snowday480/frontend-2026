document.addEventListener("DOMContentLoaded", () => {
    // DOM через querySelector
    const userNameEl = document.querySelector("#user-name");
    const userScoreEl = document.querySelector("#user-score");
    const userNumberEl = document.querySelector("#user-number");

    const compScoreEl = document.querySelector("#comp-score");
    const compNumberEl = document.querySelector("#comp-number");

    const generateBtn = document.querySelector("#generate-btn");
    const restartBtn = document.querySelector("#restart-btn");
    const statusEl = document.querySelector("#game-status");

    let userName = "User";
    let userScore = 0;
    let compScore = 0;
    const WIN_SCORE = 3;

    const askUserName = () => {
        let name = "";
        while (!name) {
            let input = prompt("Введіть ваше ім'я:");

            // Cancel
            if (input === null) {
                name = "User";
                break;
            }

            input = input.trim();

            if (input.length < 2) {
                alert("Ім'я повинно містити щонайменше 2 символи! Спробуйте ще раз.");
            } else {
                name = input;
            }
        }
        userName = name;
        userNameEl.textContent = userName;
    };

    setTimeout(askUserName, 150);

    const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

    generateBtn.addEventListener("click", () => {
        userNumberEl.classList.remove("winner");
        compNumberEl.classList.remove("winner");

        const userNum = getRandomNumber();
        const compNum = getRandomNumber();

        userNumberEl.textContent = userNum;
        compNumberEl.textContent = compNum;

        if (userNum > compNum) {
            userScore++;
            userScoreEl.textContent = userScore;
            userNumberEl.classList.add("winner");
            statusEl.textContent = `Раунд виграв ${userName}! (${userNum} > ${compNum})`;
        } else if (compNum > userNum) {
            compScore++;
            compScoreEl.textContent = compScore;
            compNumberEl.classList.add("winner");
            statusEl.textContent = `Раунд виграв Комп'ютер! (${compNum} > ${userNum})`;
        } else {
            statusEl.textContent = `Нічия в раунді! Обидва викинули ${userNum}`;
        }

        if (userScore === WIN_SCORE || compScore === WIN_SCORE) {
            generateBtn.disabled = true;
            restartBtn.style.display = "inline-block";

            if (userScore === WIN_SCORE) {
                statusEl.textContent = `Переміг ${userName} з рахунком ${userScore}:${compScore}!`;
            } else {
                statusEl.textContent = `Комп'ютер переміг з рахунком ${compScore}:${userScore}!`;
            }
        }
    });

    restartBtn.addEventListener("click", () => {
        userScore = 0;
        compScore = 0;
        userScoreEl.textContent = "0";
        compScoreEl.textContent = "0";
        userNumberEl.textContent = "0";
        compNumberEl.textContent = "0";

        userNumberEl.classList.remove("winner");
        compNumberEl.classList.remove("winner");

        generateBtn.disabled = false;
        restartBtn.style.display = "none";
        statusEl.textContent = "Нова гра розпочалася! Натисніть 'Generate'";
    });
});
