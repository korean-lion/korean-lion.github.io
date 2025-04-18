const numbers = {
    0: "영",
    1: "하나",
    2: "둘",
    3: "셋",
    4: "넷",
    5: "다섯",
    6: "여섯",
    7: "일곱",
    8: "여덟",
    9: "아홉",
    10: "열",
    11: "열 하나",
    12: "열 둘",
    13: "열 셋",
    14: "열 넷",
    15: "열 다섯",
    16: "열 여섯",
    17: "열 일곱",
    18: "열 여덟",
    19: "열 아홉",
    20: "스물",
    21: "스물 하나",
    22: "스물 둘",
    23: "스물 셋",
    24: "스물 넷",
    25: "스물 다섯",
    26: "스물 여섯",
    27: "스물 일곱",
    28: "스물 여덟",
    29: "스물 아홉",
    30: "서른",
    31: "서른 하나",
    32: "서른 둘",
    33: "서른 셋",
    34: "서른 넷",
    35: "서른 다섯",
    36: "서른 여섯",
    37: "서른 일곱",
    38: "서른 여덟",
    39: "서른 아홉",
    40: "마흔",
    41: "마흔 하나",
    42: "마흔 둘",
    43: "마흔 셋",
    44: "마흔 넷",
    45: "마흔 다섯",
    46: "마흔 여섯",
    47: "마흔 일곱",
    48: "마흔 여덟",
    49: "마흔 아홉",
    50: "쉰",
    51: "쉰 하나",
    52: "쉰 둘",
    53: "쉰 셋",
    54: "쉰 넷",
    55: "쉰 다섯",
    56: "쉰 여섯",
    57: "쉰 일곱",
    58: "쉰 여덟",
    59: "쉰 아홉",
    60: "예순",
    61: "예순 하나",
    62: "예순 둘",
    63: "예순 셋",
    64: "예순 넷",
    65: "예순 다섯",
    66: "예순 여섯",
    67: "예순 일곱",
    68: "예순 여덟",
    69: "예순 아홉",
    70: "일흔",
    71: "일흔 하나",
    72: "일흔 둘",
    73: "일흔 셋",
    74: "일흔 넷",
    75: "일흔 다섯",
    76: "일흔 여섯",
    77: "일흔 일곱",
    78: "일흔 여덟",
    79: "일흔 아홉",
    80: "여든",
    81: "여든 하나",
    82: "여든 둘",
    83: "여든 셋",
    84: "여든 넷",
    85: "여든 다섯",
    86: "여든 여섯",
    87: "여든 일곱",
    88: "여든 여덟",
    89: "여든 아홉",
    90: "아흔",
    91: "아흔 하나",
    92: "아흔 둘",
    93: "아흔 셋",
    94: "아흔 넷",
    95: "아흔 다섯",
    96: "아흔 여섯",
    97: "아흔 일곱",
    98: "아흔 여덟",
    99: "아흔 아홉",
    100: "백"
};

let currentInput = '';
let currentNumber; // Die aktuelle Zufallszahl
let currentSinoNumber; //Die aktuelle sinokoreanische Zahl

window.addEventListener("message", function (event) {

    if (event.data.action === "stopAll") {
        // Stoppe Sprachsynthese
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
        }

        // Ergänze Logik, um z. B. Timer oder andere Prozesse zu stoppen
        if (typeof intervalId !== 'undefined') {
            clearInterval(intervalId);
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // let lastSentHeight = 0; // Speichert die zuletzt gesendete Höhe

    function sendHeightToParent() {
        const height = document.body.scrollHeight; // Die gesamte Höhe des Inhalts
        window.parent.postMessage({ type: "resize", scrollHeight: height }, "*");
    }

// Sende die Höhe beim Laden und bei Änderungen
    window.addEventListener("load", sendHeightToParent);
    window.addEventListener("resize", sendHeightToParent); // Falls die Größe dynamisch angepasst wird

    // Initiale Höhe senden
    sendHeightToParent();

    // **MutationObserver für DOM-Änderungen**
    const observer = new MutationObserver(() => {
        sendHeightToParent(); // Trigger bei jeder DOM-Veränderung
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true }); // Beobachte DOM-Änderungen

    // **Überprüfung bei Benutzerinteraktionen (Klicks) erzwingen**
    document.body.addEventListener("click", () => {
        sendHeightToParent(); // Höhe nach Klick erneut überprüfen
    });

    // Resize-Event (falls Browserfenstergröße Änderungen bewirkt)
    window.addEventListener("resize", sendHeightToParent);
});

// Event Listener für die Enter-Taste im Eingabefeld
document.getElementById("answer").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Prüft, ob die Return/Enter-Taste gedrückt wurde
        event.preventDefault(); // Verhindert das Standardverhalten (z. B. Formular abschicken)
        checkAnswer(); // Führt die Überprüfung durch
    }
});

function speakKorean(answer) {
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = 'ko-KR'; // Setzt die Sprache auf Koreanisch
    speechSynthesis.speak(utterance);
}

function speakGerman(answer) {
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = 'de-DE'; // Setzt die Sprache auf Deutsch
    speechSynthesis.speak(utterance);
}

function playSound(src) {
    const audio = new Audio(src);
    audio.play().catch(error => console.error("Audio konnte nicht abgespielt werden:", error));
}

function addKeyToInput(key) {
    const answerField = document.getElementById("answer");
    answerField.value += key; // Füge den gedrückten Schlüssel zum Eingabefeld hinzu
    answerField.focus(); // Setze den Fokus auf das Eingabefeld
}

function removeLastCharacter() {
    const answerField = document.getElementById("answer");
    answerField.value = answerField.value.slice(0, -1); // Entferne das letzte Zeichen
}

// Funktion, die beim Klick über onclick ausgelöst wird
function handleReplayClick() {
    const replayButton = document.getElementById("replayButton");
    replayButton.disabled = true; // Button deaktivieren

    // Nach 1 Sekunde den Button wieder aktivieren
    setTimeout(() => {
        replayButton.disabled = false;
    }, 1000);

    // Die ursprüngliche Funktionalität ausführen
    switch (language) {
        case 'german':
            speakGerman(currentNumber);
            break;
        case 'korean':
            speakKorean(numbers[currentNumber]);
            break;
        case 'sino':
            speakKorean(currentSinoNumber);
            break;
        default:
            console.warn("Keine gültige Sprache ausgewählt.");
            break;
    }
}
function generateUniqueRandomNumber(maxRange) {
    let newNumber;

    do {
        newNumber = Math.floor(Math.random() * (maxRange + 1)); // Neue Zufallszahl zwischen 0 und maxRange
    } while (newNumber === currentNumber); // Wiederholen, wenn die Zahlen übereinstimmen

    return newNumber; // Die neue Zufallszahl zurückgeben
}

function generateFeedback(userInputStr, correctNumberStr) {
    let feedbackUser = "";
    let feedbackCorrect = "";
    const maxLength = Math.max(correctNumberStr.length, userInputStr.length);

    playSound("../sounds/error.mp3"); // Ton für falsche Lösung

    for (let i = 0; i < maxLength; i++) {
        if (userInputStr[i] === correctNumberStr[i]) {
            // Richtig eingegebene Stelle in Grün
            feedbackUser += `<span style="color: green;">${userInputStr[i] || ""}</span>`;
            feedbackCorrect += `<span style="color: green;">${correctNumberStr[i] || ""}</span>`;
        } else {
            // Falsch eingegebene Stelle in Rot
            feedbackUser += `<span style="color: red;">${userInputStr[i] || "_"}</span>`;
            feedbackCorrect += `<span style="color: red;">${correctNumberStr[i] || "_"}</span>`;
        }
    }

    // Rückgabe als Objekt (assoziatives Array)
    return {
        feedbackUser,
        feedbackCorrect,
    };
}

// Quiz und Tastatur generieren
generateQuiz();