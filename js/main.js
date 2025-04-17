// 1. Stoppe Prozesse bei reload/navigieren
window.addEventListener("beforeunload", function () {
    const quizFrame = document.getElementById("quizFrame");
    quizFrame.src = `${selectedQuiz}?noCache=${Date.now()}`;

    // 1a: Beende speechSynthesis-Prozesse
    if (speechSynthesis && (speechSynthesis.speaking || speechSynthesis.pending)) {
        speechSynthesis.cancel(); // Stoppe Sprachprozesse
    }

    // 1b: Entlade iframe vollständig
    if (quizFrame) {
        quizFrame.src = "about:blank"; // Setze iframe auf leer
    }
});

// 2. Nachricht an iframe senden - stoppe intern laufende Prozesse
function sendStopMessageToIframe() {
    const oldIframe = document.getElementById("quizFrame");
    if (oldIframe && oldIframe.contentWindow) {
        // Nachricht ans iframe senden, um aktive Prozesse zu stoppen
        oldIframe.contentWindow.postMessage({ action: "stopAll" }, "*");
    }
}

// 3. Event listener für Quizwechsel
document.querySelectorAll('input[name="quiz"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        const selectedQuiz = this.value;
        const container = document.querySelector(".container");
        const oldIframe = document.getElementById("quizFrame");

        sendStopMessageToIframe(); // Prozesse im alten iframe beenden

        // Entfernen des alten iframes
        if (oldIframe) {
            oldIframe.remove();
        }

        // Neues iframe erstellen
        const newIframe = document.createElement("iframe");
        newIframe.id = "quizFrame";
        newIframe.src = selectedQuiz;
        newIframe.style.width = "100%";
        newIframe.style.height = "830px";
        newIframe.hidden = false;

        container.appendChild(newIframe); // Neues iframe einfügen
    });
});

document.querySelectorAll('input[name="quiz"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        const selectedQuiz = this.value;
        const quizFrame = document.getElementById("quizFrame");

        quizFrame.src = selectedQuiz;
        quizFrame.hidden = false; // Blende das iframe ein

        // Sobald der Inhalt im iframe geladen ist
        quizFrame.onload = function () {
            try {
                // Zugriff auf den iframe Inhalt
                const iframeBody = quizFrame.contentWindow.document.body;
                iframeBody.style.margin = "10px"; // Entferne margin
                iframeBody.style.padding = "0"; // Entferne padding

                // Zusätzlich können andere Styles angepasst werden
                iframeBody.style.boxSizing = "border-box";
                iframeBody.style.fontFamily = "inherit"; // Matching Font
            } catch (error) {
                console.error("Kann body-Stile nicht ändern. Möglicherweise ein Cross-Origin-Problem.", error);
            }
        };
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Setzt sicher, dass keine Radio-Option vorausgewählt ist
    document.querySelectorAll('input[name="quiz"]').forEach(function(radio) {
        radio.checked = false;
        //radio.removeEventListener();
    });
});
// Event Listener für Radio-Buttons
document.querySelectorAll('input[name="quiz"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        // Sobald eine Auswahl getroffen wird, lade das Quiz
        const selectedQuiz = this.value;

        // Lade das Quiz in das iframe
        const quizFrame = document.getElementById('quizFrame');
        quizFrame.src = selectedQuiz;
        quizFrame.hidden = false; // Blende das iframe ein
    });
});