document.addEventListener("DOMContentLoaded", () => {
    const userNameEl = document.querySelector("#user-name");
    const attemptInfoEl = document.querySelector("#attempt-info");
    const generateBtn = document.querySelector("#generate-btn");
    const restartBtn = document.querySelector("#restart-btn");
    const statusEl = document.querySelector("#game-status");
    const paylineEl = document.querySelector("#payline");
    const leverTrackEl = document.querySelector("#lever-track");

    const strips = [
        document.querySelector("#strip-1"),
        document.querySelector("#strip-2"),
        document.querySelector("#strip-3")
    ];
    const reels = [
        document.querySelector("#reel-1"),
        document.querySelector("#reel-2"),
        document.querySelector("#reel-3")
    ];

    let userName = "User";
    let attempt = 0;
    let isSpinning = false;
    let hasWon = false;
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

    // Доступні картинки
    const symbols = [
        { id: "money_bag", src: "images/money_bag.svg", name: "Мішок грошей" },
        { id: "peach",     src: "images/peach.svg",     name: "Персик" },
        { id: "apple",     src: "images/apple.svg",     name: "Яблуко" },
        { id: "lemon",     src: "images/lemon.svg",     name: "Лимон" },
        { id: "cherries",  src: "images/cherries.svg",  name: "Вишні" },
        { id: "pear",      src: "images/pear.svg",      name: "Груша" }
    ];

    // Відображення 3 картинок у барабані
    const renderReel = (stripEl, items) => {
        stripEl.innerHTML = "";
        items.forEach(item => {
            const symDiv = document.createElement("div");
            symDiv.className = "reel-symbol";
            const img = document.createElement("img");
            img.src = item.src;
            img.alt = item.name;
            symDiv.appendChild(img);
            stripEl.appendChild(symDiv);
        });
    };

    // Генерація 3 неповторюваних картинок для одного барабана
    const getRandomColumn = () => {
        const shuffled = [...symbols].sort(() => Math.random() - 0.5);
        return [shuffled[0], shuffled[1], shuffled[2]];
    };

    // Початковий стан барабанів
    let currentGrid = [getRandomColumn(), getRandomColumn(), getRandomColumn()];
    strips.forEach((strip, i) => renderReel(strip, currentGrid[i]));

    // Запуск обертання
    const spin = () => {
        if (isSpinning || attempt >= MAX_ATTEMPTS || hasWon) return;

        isSpinning = true;
        attempt++;
        attemptInfoEl.textContent = `Спроба ${attempt} з ${MAX_ATTEMPTS}`;

        // Анімація важеля
        leverTrackEl.classList.add("pulled");
        setTimeout(() => leverTrackEl.classList.remove("pulled"), 250);

        generateBtn.disabled = true;
        paylineEl.classList.remove("active");
        reels.forEach(r => r.classList.remove("winner"));
        statusEl.textContent = "Барабани крутяться...";
        statusEl.style.color = "#ffffff";

        // Анімація прокрутки для кожного барабана
        strips.forEach(s => s.classList.add("spinning"));

        // Нові результати (по вертикалі картинки не повторюються)
        const newGrid = [getRandomColumn(), getRandomColumn(), getRandomColumn()];

        // Почергова зупинка барабанів
        const stopDelays = [400, 600, 800];
        stopDelays.forEach((delay, index) => {
            setTimeout(() => {
                strips[index].classList.remove("spinning");
                renderReel(strips[index], newGrid[index]);

                // Коли зупинився останній барабан
                if (index === 2) {
                    currentGrid = newGrid;
                    isSpinning = false;
                    checkGameResult();
                }
            }, delay);
        });
    };

    // Перевірка умови виграшу (ряд однакових картинок)
    const checkGameResult = () => {
        // Перевіряємо всі 3 горизонтальні ряди (0 - верхній, 1 - центральний, 2 - нижній)
        let winningRow = -1;
        for (let row = 0; row < 3; row++) {
            if (
                currentGrid[0][row].id === currentGrid[1][row].id &&
                currentGrid[1][row].id === currentGrid[2][row].id
            ) {
                winningRow = row;
                break;
            }
        }

        if (winningRow !== -1) {
            hasWon = true;
            generateBtn.disabled = true;
            restartBtn.style.display = "inline-block";
            paylineEl.classList.add("active");
            reels.forEach(r => r.classList.add("winner"));

            statusEl.textContent = `🎉 ПЕРЕМОГА! ${userName} вибив однаковий ряд!`;
            statusEl.style.color = "#00ff00";
            return;
        }

        // Завершення гри після 3 спроб без перемоги
        if (attempt >= MAX_ATTEMPTS) {
            generateBtn.disabled = true;
            restartBtn.style.display = "inline-block";
            statusEl.textContent = "3 спроби вичерпано. Спробуйте ще раз!";
            statusEl.style.color = "#ff6666";
        } else {
            generateBtn.disabled = false;
            statusEl.textContent = `Спроба ${attempt} з ${MAX_ATTEMPTS}: однаковий ряд не випав`;
            statusEl.style.color = "#ffffff";
        }
    };

    // Перезапуск гри
    restartBtn.addEventListener("click", () => {
        attempt = 0;
        hasWon = false;
        isSpinning = false;

        attemptInfoEl.textContent = "Спроба 0 з 3";
        statusEl.textContent = "Натисніть 'Generate' або потягніть важіль";
        statusEl.style.color = "#ffffff";

        paylineEl.classList.remove("active");
        reels.forEach(r => r.classList.remove("winner"));

        generateBtn.disabled = false;
        restartBtn.style.display = "none";

        currentGrid = [getRandomColumn(), getRandomColumn(), getRandomColumn()];
        strips.forEach((strip, i) => renderReel(strip, currentGrid[i]));
    });

    generateBtn.addEventListener("click", spin);
    leverTrackEl.addEventListener("click", spin);
});
