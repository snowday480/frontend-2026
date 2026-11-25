document.addEventListener("DOMContentLoaded", () => {
    const balanceInput = document.querySelector("#balance-input");
    const betInput = document.querySelector("#bet-input");
    const statusEl = document.querySelector("#game-status");
    const gameOverBoxEl = document.querySelector("#game-over-box");
    const resetBalanceBtn = document.querySelector("#reset-balance-btn");
    const leverTrackEl = document.querySelector("#lever-track");
    const leverKnobEl = document.querySelector("#lever-knob");

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

    const symbols = [
        { id: "money_bag", src: "images/money-bag_1f4b0.png" },
        { id: "peach",     src: "images/peach_1f351.png" },
        { id: "lemon",     src: "images/lemon_1f34b.png" },
        { id: "cherries",  src: "images/cherries_1f352.png" },
        { id: "grapes",    src: "images/grapes_1f347.png" },
        { id: "pepper",    src: "images/hot-pepper_1f336-fe0f.png" }
    ];

    let initialBalance = 1000;
    let balance = 1000;
    let bet = 50;
    let isSpinning = false;
    let gameStarted = false;

    // Введення початкового балансу
    balanceInput.addEventListener("change", () => {
        if (gameStarted) return;
        const val = parseInt(balanceInput.value, 10);
        if (val > 0) {
            balance = val;
            initialBalance = val;
        } else {
            balanceInput.value = initialBalance;
        }
    });

    // Зміна ставки
    betInput.addEventListener("change", () => {
        const val = parseInt(betInput.value, 10);
        if (val > 0) {
            bet = val;
        } else {
            betInput.value = bet;
        }
    });

    // Малювання картинок у барабані
    const renderReel = (stripEl, items) => {
        stripEl.innerHTML = "";
        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "reel-symbol";
            const img = document.createElement("img");
            img.src = item.src;
            div.appendChild(img);
            stripEl.appendChild(div);
        });
    };

    const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

    // 3 випадкові картинки для одного барабана
    const getRandomColumn = () => [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];

    // Початкове заповнення барабанів
    let currentGrid = [getRandomColumn(), getRandomColumn(), getRandomColumn()];
    strips.forEach((strip, i) => renderReel(strip, currentGrid[i]));

    // Запуск оберту
    const spin = () => {
        if (isSpinning || balance <= 0) return;

        const currentBet = parseInt(betInput.value, 10);
        if (isNaN(currentBet) || currentBet <= 0) {
            statusEl.textContent = "Введіть коректну ставку!";
            return;
        }
        if (currentBet > balance) {
            statusEl.textContent = "Недостатньо коштів на балансі!";
            return;
        }
        bet = currentBet;

        // Блок баланса
        if (!gameStarted) {
            gameStarted = true;
            balanceInput.readOnly = true;
            balanceInput.classList.add("locked");
        }

        isSpinning = true;
        betInput.disabled = true;
        leverTrackEl.classList.add("disabled");

        balance -= bet;
        balanceInput.value = balance;

        reels.forEach(r => r.classList.remove("winner"));
        statusEl.textContent = "Барабани крутяться...";

        // 6 картинок повторено двічі = 12 картинок
        const loopTrack = [...symbols, ...symbols];
        strips.forEach(strip => {
            renderReel(strip, loopTrack);
            strip.classList.add("spinning");
        });

        // Визн результат
        let newGrid;
        if (Math.random() < 0.25) {
            const winSym = getRandomSymbol();
            newGrid = [
                [getRandomSymbol(), winSym, getRandomSymbol()],
                [getRandomSymbol(), winSym, getRandomSymbol()],
                [getRandomSymbol(), winSym, getRandomSymbol()]
            ];
        } else {
            newGrid = [getRandomColumn(), getRandomColumn(), getRandomColumn()];
        }

        const stopDelays = [1000, 1800, 2600];

        stopDelays.forEach((delay, index) => {
            setTimeout(() => {
                strips[index].classList.remove("spinning"); // вимикаємо крутку
                renderReel(strips[index], newGrid[index]);   // ставимо фінальні 3 картинки
                strips[index].classList.add("landing");      // додаємо плавний відскок

                setTimeout(() => {
                    strips[index].classList.remove("landing");
                }, 350);

                // Зупинився останній барабан
                if (index === 2) {
                    currentGrid = newGrid;
                    isSpinning = false;
                    betInput.disabled = false;
                    checkGameResult();
                }
            }, delay);
        });
    };

    // Перевірка результату
    const checkGameResult = () => {
        const isWin = (
            currentGrid[0][1].id === currentGrid[1][1].id &&
            currentGrid[1][1].id === currentGrid[2][1].id
        );

        if (isWin) {
            const winAmount = bet * 5;
            balance += winAmount;
            balanceInput.value = balance;

            reels.forEach(r => r.classList.add("winner"));
            leverTrackEl.classList.remove("disabled");
            statusEl.textContent = `ПЕРЕМОГА! +${winAmount} $`;
            return;
        }

        // гроші всьо
        if (balance <= 0) {
            statusEl.style.display = "none";
            gameOverBoxEl.style.display = "flex";
            leverTrackEl.classList.add("disabled");
        } else {
            leverTrackEl.classList.remove("disabled");
            statusEl.textContent = `Не пощастило (-${bet} $). Потягніть важіль ще раз!`;
        }
    };

    // Перетягування важеля вниз
    let isDragging = false;
    let startY = 0;
    let currentDragY = 0;
    const maxDrag = 94;

    leverKnobEl.addEventListener("pointerdown", (e) => {
        if (isSpinning || balance <= 0) return;
        isDragging = true;
        startY = e.clientY;
        currentDragY = 0;
        leverKnobEl.classList.add("dragging");
        leverKnobEl.setPointerCapture(e.pointerId);
    });

    leverKnobEl.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const delta = Math.max(0, Math.min(e.clientY - startY, maxDrag));
        currentDragY = delta;
        leverKnobEl.style.transform = `translateY(${delta}px)`;
    });

    const finishDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        leverKnobEl.classList.remove("dragging");

        // Якщо потягнули хоча б на половину або просто клікнули
        if (currentDragY >= maxDrag * 0.5 || currentDragY < 6) {
            leverKnobEl.style.transform = `translateY(${maxDrag}px)`;
            spin();
            setTimeout(() => {
                leverKnobEl.style.transform = "translateY(0px)";
            }, 250);
        } else {
            leverKnobEl.style.transform = "translateY(0px)";
        }
        currentDragY = 0;
    };

    leverKnobEl.addEventListener("pointerup", finishDrag);
    leverKnobEl.addEventListener("pointercancel", finishDrag);

    // клік запуску
    leverTrackEl.addEventListener("click", (e) => {
        if (e.target === leverKnobEl || isSpinning || balance <= 0) return;
        leverKnobEl.style.transform = `translateY(${maxDrag}px)`;
        spin();
        setTimeout(() => {
            leverKnobEl.style.transform = "translateY(0px)";
        }, 250);
    });

    // відновлення балансу
    resetBalanceBtn.addEventListener("click", () => {
        balance = initialBalance;
        balanceInput.value = balance;
        balanceInput.readOnly = false;
        balanceInput.classList.remove("locked");
        gameStarted = false;

        gameOverBoxEl.style.display = "none";
        statusEl.style.display = "block";
        statusEl.textContent = "Потягніть важіль вниз!";

        reels.forEach(r => r.classList.remove("winner"));
        leverTrackEl.classList.remove("disabled");
        leverKnobEl.style.transform = "translateY(0px)";
    });
});