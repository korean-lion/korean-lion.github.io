// Konvertiert eine Zahl in sino-koreanische Zahlen
function generateSinokoreanNumber(number) {
    if (typeof number !== 'number' || number % 1 !== 0) {
        throw new Error('Die Eingabe muss eine ganze Zahl sein.');
    }

    const sinoKoreanDigits = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const sinoKoreanUnits = ['', '십', '백', '천'];
    const sinoKoreanLargeUnits = ['', '만', '억', '조', '경'];

    // Zahl in Ziffern aufteilen und umdrehen
    const digits = String(number).split('').reverse();
    let result = '';
    let groupResult = ''; // Zwischenwert für die aktuellen 4 Ziffern
    let largeUnitIndex = 0; // Index für große Einheiten (만, 억, ...)

    for (let i = 0; i < digits.length; i++) {
        const digit = parseInt(digits[i]);
        const unitPosition = i % 4; // Position innerhalb des 4er-Blocks

        if (digit !== 0) {
            // Sonderfall: Die Zehnerstelle hat eine "1"
            if (digit === 1 && unitPosition === 1) {
                groupResult = sinoKoreanUnits[unitPosition] + groupResult; // Nur "십", ohne "일"
            } else {
                groupResult = sinoKoreanDigits[digit] + sinoKoreanUnits[unitPosition] + groupResult;
            }
        }

        // Wenn das Ende eines 4er-Blocks erreicht ist oder die letzte Ziffer erreicht ist
        if (unitPosition === 3 || i === digits.length - 1) {
            if (groupResult) {
                // Große Einheit hinzufügen, falls der Block nicht leer ist
                result = groupResult + sinoKoreanLargeUnits[largeUnitIndex] + result;
            }
            groupResult = ''; // Zurücksetzen des Block-Resultats
            largeUnitIndex++; // Zur nächsten großen Einheit wechseln
        }
    }

    return result || sinoKoreanDigits[0]; // Rückgabe "영" für 0
}

function formatNumberWithThousandSeparator(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Tausenderpunkt hinzufügen
}

function formatKoreanNumberWithSpaces(number) {
    return number.replace(/([백천만억조])(?=\D)/g, '$1 '); // Füge ein Leerzeichen nach den Einheiten hinzu, wenn etwas folgt
    //return number.replace(/(백|천|만|억|조)(?=\D)/g, '$1 '); // Füge ein Leerzeichen nach den Einheiten hinzu, wenn etwas folgt
}