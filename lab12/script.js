$(document).ready(function() {
    const dictionaries = {
        easy: [
            { en: "always", ua: ["завжди", "постійно"] },
            { en: "friend", ua: ["друг", "приятель", "подруга"] },
            { en: "world", ua: ["світ"] },
            { en: "family", ua: ["сім'я", "сімʼя", "родина"] },
            { en: "water", ua: ["вода"] },
            { en: "book", ua: ["книга", "книжка"] },
            { en: "house", ua: ["будинок", "дім"] },
            { en: "sun", ua: ["сонце"] },
            { en: "happy", ua: ["щасливий", "радісний"] },
            { en: "time", ua: ["час"] }
        ],
        medium: [
            { en: "sometimes", ua: ["іноді", "інколи", "часом"] },
            { en: "knowledge", ua: ["знання"] },
            { en: "language", ua: ["мова"] },
            { en: "future", ua: ["майбутнє"] },
            { en: "success", ua: ["успіх"] },
            { en: "education", ua: ["освіта"] },
            { en: "journey", ua: ["подорож", "мандрівка"] },
            { en: "decision", ua: ["рішення"] },
            { en: "improve", ua: ["покращувати", "покращити", "поліпшити"] },
            { en: "experience", ua: ["досвід"] }
        ],
        hard: [
            { en: "inevitable", ua: ["неминучий", "невідворотний"] },
            { en: "resilient", ua: ["стійкий", "витривалий"] },
            { en: "ambiguous", ua: ["двозначний", "неоднозначний"] },
            { en: "perspective", ua: ["перспектива", "точка зору"] },
            { en: "consequence", ua: ["наслідок"] },
            { en: "sustainable", ua: ["сталий", "стійкий"] },
            { en: "elaborate", ua: ["детальний", "ретельний", "розробляти"] },
            { en: "comprehensive", ua: ["всебічний", "вичерпний", "повний"] },
            { en: "significant", ua: ["значний", "важливий", "суттєвий"] },
            { en: "opportunity", ua: ["можливість", "нагода"] }
        ]
    };

    const difficultyNames = {
        easy: "Початковий",
        medium: "Середній",
        hard: "Високий"
    };

    let currentDifficulty = "easy";
    let list = [];
    let step = 0;
    let correct = 0;
    let incorrect = 0;

    function init() {
        list = [...dictionaries[currentDifficulty]].sort(() => Math.random() - 0.5);
        step = 0;
        correct = 0;
        incorrect = 0;
        $("#correct-count").text(0);
        $("#incorrect-count").text(0);
        $("#results-modal").hide();
        loadWord();
    }

    function loadWord() {
        $("#step-indicator").text((step + 1) + " / " + list.length);
        $("#current-word").text(list[step].en);
        $("#translation-input").val("").removeClass("input-error").focus();
        $("#error-message").hide();
    }

    function check() {
        const val = $("#translation-input").val().trim().toLowerCase();
        if (!val) {
            $("#translation-input").addClass("input-error");
            $("#error-message").show();
            return;
        }

        if (list[step].ua.includes(val)) {
            correct++;
            $("#correct-count").text(correct);
        } else {
            incorrect++;
            $("#incorrect-count").text(incorrect);
        }

        step++;
        if (step < list.length) {
            loadWord();
        } else {
            showModal();
        }
    }

    function showModal() {
        let level = "Початковий (A1)";
        if (correct >= 9) level = "Високий (C1 / C2)";
        else if (correct >= 7) level = "Вище середнього (B2)";
        else if (correct >= 5) level = "Середній (B1)";
        else if (correct >= 3) level = "Елементарний (A2)";

        $("#modal-difficulty").text("Складність: " + difficultyNames[currentDifficulty]);
        $("#final-score").text(correct + " / " + list.length);
        $("#level-badge").text(level);
        $("#modal-correct").text(correct);
        $("#modal-incorrect").text(incorrect);
        $("#results-modal").fadeIn(150);
    }

    $('input[name="difficulty"]').on("change", function() {
        currentDifficulty = $(this).val();
        $(this).closest(".level-option").addClass("active").siblings().removeClass("active");
        init();
    });

    $("#word-card, #check-btn").on("click", check);

    $("#translation-input").on("keypress", function(e) {
        if (e.which === 13) check();
    }).on("input", function() {
        $(this).removeClass("input-error");
        $("#error-message").hide();
    });

    $("#prev-btn").on("click", function() {
        if (step > 0) {
            step--;
            loadWord();
        }
    });

    $("#next-btn").on("click", function() {
        if (step < list.length - 1) {
            step++;
            loadWord();
        }
    });

    $("#restart-btn").on("click", init);

    init();
});
