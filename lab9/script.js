document.addEventListener("DOMContentLoaded", () => {
    const userNameEl = document.querySelector("#user-name");
    const userScoreEl = document.querySelector("#user-score");
    const userCardEl = document.querySelector("#user-card");

    const compScoreEl = document.querySelector("#comp-score");
    const compCardEl = document.querySelector("#comp-card");

    const attemptInfoEl = document.querySelector("#attempt-info");
    const generateBtn = document.querySelector("#generate-btn");
    const restartBtn = document.querySelector("#restart-btn");
    const statusEl = document.querySelector("#game-status");

    let userName = "User";
    let userScore = 0;
    let compScore = 0;
    let attempt = 0;
    const MAX_ATTEMPTS = 3;

    // Валідація введення імені
    const askUserName = () => {
        let name = "";
        while (!name) {
            let input = prompt("Введіть ваше ім'я:");
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

    const cardTypes = [
        { name: "6", value: 6, rank: "6" },
        { name: "7", value: 7, rank: "7" },
        { name: "8", value: 8, rank: "8" },
        { name: "9", value: 9, rank: "9" },
        { name: "10", value: 10, rank: "10" },
        { name: "Валет", value: 2, rank: "jack" },
        { name: "Дама", value: 3, rank: "queen" },
        { name: "Король", value: 4, rank: "king" },
        { name: "Туз", value: 11, rank: "ace" }
    ];

    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const deck = [];
    for (let c of cardTypes) {
        for (let s of suits) {
            deck.push({
                name: c.name,
                value: c.value,
                img: `cards/${c.rank}_of_${s}.svg`
            });
        }
    }

    const getRandomCard = () => deck[Math.floor(Math.random() * deck.length)];

    generateBtn.addEventListener("click", () => {
        if (attempt >= MAX_ATTEMPTS) return;

        attempt++;
        attemptInfoEl.textContent = `Спроба ${attempt} з ${MAX_ATTEMPTS}`;

        userCardEl.classList.remove("winner");
        compCardEl.classList.remove("winner");

        const userCard = getRandomCard();
        const compCard = getRandomCard();

        userCardEl.src = userCard.img;
        compCardEl.src = compCard.img;

        userScore += userCard.value;
        compScore += compCard.value;

        userScoreEl.textContent = userScore;
        compScoreEl.textContent = compScore;

        if (userCard.value > compCard.value) {
            userCardEl.classList.add("winner");
        } else if (compCard.value > userCard.value) {
            compCardEl.classList.add("winner");
        }

        statusEl.textContent = `Спроба ${attempt}: ${userName} (+${userCard.value}), Комп'ютер (+${compCard.value})`;
        statusEl.style.color = "#000000";

        // Завершення гри після 3 спроб
        if (attempt === MAX_ATTEMPTS) {
            generateBtn.disabled = true;
            restartBtn.style.display = "inline-block";

            if (userScore > compScore) {
                statusEl.textContent = `Переміг ${userName} з рахунком ${userScore}:${compScore}!`;
                statusEl.style.color = "#008800";
            } else if (compScore > userScore) {
                statusEl.textContent = `Комп'ютер переміг з рахунком ${compScore}:${userScore}!`;
                statusEl.style.color = "#cc0000";
            } else {
                statusEl.textContent = `Нічия з рахунком ${userScore}:${compScore}!`;
                statusEl.style.color = "#0055aa";
            }
        }
    });

    restartBtn.addEventListener("click", () => {
        attempt = 0;
        userScore = 0;
        compScore = 0;

        userScoreEl.textContent = "0";
        compScoreEl.textContent = "0";

        userCardEl.src = "cards/back.svg";
        compCardEl.src = "cards/back.svg";

        userCardEl.classList.remove("winner");
        compCardEl.classList.remove("winner");

        attemptInfoEl.textContent = "Спроба 0 з 3";
        statusEl.textContent = "Нова гра розпочалася! Натисніть 'Generate'";
        statusEl.style.color = "#000000";

        generateBtn.disabled = false;
        restartBtn.style.display = "none";
    });
});
