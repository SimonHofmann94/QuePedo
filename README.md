# Spanish Trainer App

Eine interaktive Spanisch-Lern-App mit Karteikastensystem und Spaced-Repetition-Algorithmus.

## Features

- **Karteikastensystem**: 5-Box Spaced-Repetition System für effektives Lernen
- **Vokabelmanagement**: Hinzufügen, Bearbeiten und Suchen von Vokabeln
- **Flexible Abfragen**: Kapitel- und boxspezifische Vokabelabfragen
- **Bidirektional**: Deutsch→Spanisch und Spanisch→Deutsch Übersetzungen
- **Intelligente Antwortprüfung**: Ignoriert deutsche Artikel bei der Bewertung
- **GPT-Integration**: Verbkonjugation und Übersetzungsfunktionen (geplant)

## Installation

1. Repository klonen:
```bash
git clone git@github.com:SimonHofmann94/SpanishTrainer.git
cd SpanishTrainer
```

2. Virtual Environment erstellen und aktivieren:
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# oder
source .venv/bin/activate  # macOS/Linux
```

3. Dependencies installieren:
```bash
pip install -r requirements.txt
```

## Verwendung

### Terminal-Version
```bash
python advanced_trainer.py
```

### Web-Version (in Entwicklung)
Die Web-Version wird mit Flask/FastAPI implementiert und bietet eine moderne, responsive Benutzeroberfläche.

## Datenstruktur

Die Vokabeln werden in einer CSV-Datei gespeichert mit folgenden Feldern:
- `german`: Deutsche Übersetzung
- `spanish`: Spanisches Wort
- `chapter`: Kapitelzuordnung
- `box`: Lernfortschritt (1-5)

## Geplante Features

- [ ] Web-Interface mit modernem Design
- [ ] Benutzeranmeldung und -verwaltung
- [ ] Erweiterte Statistiken und Lernfortschritt
- [ ] Audio-Unterstützung für Aussprache
- [ ] Mobile App
- [ ] Offline-Funktionalität

## Technologie-Stack

- **Backend**: Python (Flask/FastAPI)
- **Frontend**: HTML5, CSS3, JavaScript
- **Datenbank**: CSV → SQLite → PostgreSQL (geplant)
- **AI-Integration**: OpenAI GPT für Konjugation und Übersetzung

## Lizenz

MIT License
