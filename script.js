let fragen = [];
let aktuelleFrageIndex = -1;
let offen = 0;
let gewusst = 0;

async function ladeFragen() {
    try {
        const response = await fetch('fragen.csv');
        const data = await response.text();
        const zeilen = data.trim().split('\n'); // Zeilen anhand von Zeilenumbrüchen trennen

        // Überprüfen, ob die CSV-Daten korrekt geladen wurden
        console.log("Geladene CSV-Daten:", zeilen);

        zeilen.forEach(zeile => {
            const spalten = zeile.split(';').map(spalte => spalte.trim()); // Trennung durch ; und Leerzeichen entfernen
            const frage = spalten[0];
            const antworten = spalten.slice(1).filter(a => a); // Nur nicht-leere Antworten verwenden

            // Wenn eine Frage und Antworten vorhanden sind, füge sie zur Liste hinzu
            if (frage && antworten.length > 0) {
                fragen.push({ frage, antworten });
            }
        });

        // Überprüfen, ob Fragen korrekt geladen wurden
        console.log("Fragen und Antworten:", fragen);

        // Initialisiere den Offen-Zähler und zeige die erste Frage
        offen = fragen.length;
        document.getElementById('offen-counter').textContent = offen;
        zeigeNeueFrage();

    } catch (error) {
        console.error("Fehler beim Laden der CSV-Datei:", error);
    }
}

function zeigeNeueFrage() {
    if (offen === 0) {
        document.getElementById('frage-bereich').textContent = "Fertig!";
        document.getElementById('antwort-bereich').textContent = "Neustart mit OK";
        return;
    }

    // Wähle eine zufällige Frage
    aktuelleFrageIndex = Math.floor(Math.random() * fragen.length);
    const aktuelleFrage = fragen[aktuelleFrageIndex];

    // Zeige die Frage
    document.getElementById('frage-bereich').textContent = aktuelleFrage.frage;

    // Zeige die Antworten
    const antwortBereich = document.getElementById('antwort-bereich');
    antwortBereich.innerHTML = ''; // Leere die vorherigen Antworten
    aktuelleFrage.antworten.forEach(antwort => {
        const li = document.createElement('li');
        li.textContent = antwort;
        antwortBereich.appendChild(li);
    });

    // Antwortbereich einblenden
    document.getElementById('antwort-bereich').style.display = 'none'; // Standardmäßig ausgeblendet
}

function frageBeantworten(gewusstAntwort) {
    if (gewusstAntwort) {
        gewusst++;
        offen--;
        fragen.splice(aktuelleFrageIndex, 1); // Frage aus dem Abfragepool entfernen
    }
    document.getElementById('offen-counter').textContent = offen;
    document.getElementById('gewusst-counter').textContent = gewusst;
    zeigeNeueFrage(); // Zeige die nächste Frage
}

// Button Event-Listener
document.getElementById('ok-button').addEventListener('click', () => {
    frageBeantworten(true);
});

document.getElementById('skip-button').addEventListener('click', () => {
    frageBeantworten(false);
});

document.getElementById('show-button').addEventListener('mousedown', () => {
    document.getElementById('antwort-bereich').style.display = 'block';
});

document.getElementById('show-button').addEventListener('mouseup', () => {
    document.getElementById('antwort-bereich').style.display = 'none';
});

document.getElementById('ok-button').addEventListener('mousedown', () => {
    document.getElementById('antwort-bereich').style.display = 'block';
});

document.getElementById('ok-button').addEventListener('mouseup', () => {
    document.getElementById('antwort-bereich').style.display = 'none';
});

document.getElementById('skip-button').addEventListener('mousedown', () => {
    document.getElementById('antwort-bereich').style.display = 'block';
});

document.getElementById('skip-button').addEventListener('mouseup', () => {
    document.getElementById('antwort-bereich').style.display = 'none';
});

// Lädt die Fragen beim Start der Seite
window.onload = ladeFragen;
