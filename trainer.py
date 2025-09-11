# --------------------------------------------------------------------------------
# Kurze Anleitung zum Programm (bitte vor dem Code belassen oder anpassen):
#
# 1) Das Skript erstellt automatisch eine CSV-Datei (vocab.csv), falls diese nicht
#    existiert. Darin werden Vokabeln gespeichert.
#
# 2) Hauptmenü-Optionen:
#       1) Neue Vokabeln eintragen
#       2) Vokabeln abfragen
#       3) Beenden (oder 'q')
#       4) Vokabeln bearbeiten
#       5) Übersicht über alle Boxen
#       6) Vokabeln suchen
#
# 3) Beim Eintragen von Vokabeln:
#    - Zuerst Spanisch, dann Deutsch (ggf. mehrere Bedeutungen per Komma),
#      dann das Kapitel. Mit 'q' kann abgebrochen werden.
#    - Falls schon existierende Kombination (spanisch+deutsch), Warnung.
#
# 4) Beim Abfragen legst du fest:
#    - Kapitel (oder 'alle')
#    - Box (oder 'alle')
#    - Anzahl der Vokabeln
#    - Richtung: Deutsch→Spanisch (1) oder Spanisch→Deutsch (2)
#      - Bei Spanisch→Deutsch wird ein führender Artikel ignoriert.
#      - Mehrere deutsche Bedeutungen (kommagetrennt) sind möglich.
#        Eine davon reicht als richtige Antwort.
#    - Richtige Antworten erhöhen die Box-Stufe um 1.
#
# 5) Beim Bearbeiten (Punkt 4) kannst du eine Vokabel suchen und deren Inhalte
#    (Spanisch, Deutsch, Kapitel, Box) anpassen.
#
# 6) Bei der Übersicht (Punkt 5) siehst du, wie viele Vokabeln sich in welcher Box
#    befinden.
#
# 7) Bei der Suche (Punkt 6) kannst du beliebig oft einen Suchbegriff eingeben (bis 'q'),
#    und es werden alle Vokabeln aufgelistet, in denen der Suchbegriff im deutschen
#    oder spanischen Feld vorkommt (case-insensitive).
#
# Viel Spaß beim Lernen!
# --------------------------------------------------------------------------------

import csv
import os
import random
import sys

CSV_FILE = "../vocab.csv"

# Liste deutscher Artikel, die wir ignorieren möchten (für das artikel-ignorierende Matching).
GERMAN_ARTICLES = {
    "der", "die", "das",
    "ein", "eine", "einen", "einem", "eines",
    "den", "dem", "des"
}

def ensure_csv_exists():
    """Erstellt die CSV-Datei, wenn sie nicht existiert."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["german", "spanish", "chapter", "box"])

def load_vocab():
    """Lädt alle Vokabeln aus der CSV-Datei in eine Liste von Dictionaries."""
    vocab_list = []
    with open(CSV_FILE, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            row["box"] = int(row["box"])
            vocab_list.append(row)
    return vocab_list

def save_vocab(vocab_list):
    """Speichert die Liste von Vokabeln zurück in die CSV-Datei."""
    with open(CSV_FILE, mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ["german", "spanish", "chapter", "box"]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for vocab in vocab_list:
            writer.writerow(vocab)

def strip_german_article(phrase):
    """
    Entfernt ggf. den ersten Artikel, falls er in GERMAN_ARTICLES steht.
    Beispiel: "das Haus" -> "Haus", "die Häuser" -> "Häuser".
    Groß-/Kleinschreibung wird ignoriert.
    """
    words = phrase.lower().split()
    if words and words[0] in GERMAN_ARTICLES:
        return " ".join(words[1:])
    return " ".join(words)

def check_answer(user_input, correct_text, language_is_german):
    """
    Prüft, ob 'user_input' (vom Lerner) zu 'correct_text' (aus der CSV) passt.
    - correct_text kann mehrere Synonyme enthalten, mit Komma getrennt.
    - Für jedes Synonym wird eine lowercase-Version gebildet.
    - Wenn language_is_german=True, ignorieren wir einen führenden Artikel.
    - Es reicht, wenn EINE der Bedeutungen übereinstimmt.
    """
    synonyms = [s.strip() for s in correct_text.split(",")]

    valid_answers = set()
    for syn in synonyms:
        syn_lower = syn.lower()
        if language_is_german:
            # Füge sowohl "das haus" als auch artikelbereinigt "haus" hinzu
            syn_no_article = strip_german_article(syn_lower)
            valid_answers.add(syn_lower)
            valid_answers.add(syn_no_article)
        else:
            valid_answers.add(syn_lower)

    user_lower = user_input.lower()
    if language_is_german:
        user_no_article = strip_german_article(user_lower)
        return (user_lower in valid_answers) or (user_no_article in valid_answers)
    else:
        return user_lower in valid_answers

def add_vocabulary():
    """
    Fragt Vokabeln vom Nutzer ab und speichert sie in der CSV.
    Falls die Kombination (spanish+german) bereits existiert, kommt eine Warnung.
    Bei deutschen Bedeutungen mit Kommas können mehrere Synonyme eingetragen werden.
    """
    while True:
        print("\nNeues Wort eintragen (oder 'q' zum Abbrechen und Hauptmenü)")

        spanish = input("Spanisches Wort: ").strip()
        if spanish.lower() == 'q':
            break

        german = input("Deutsches Wort (bei mehreren Bedeutungen mit Komma trennen): ").strip()
        if german.lower() == 'q':
            break

        chapter = input("Kapitel: ").strip()
        if chapter.lower() == 'q':
            break

        new_vocab = {
            "spanish": spanish,
            "german": german,
            "chapter": chapter,
            "box": 1
        }

        # Check auf Duplikat:
        existing_vocabs = load_vocab()
        duplicate_found = False
        for v in existing_vocabs:
            if (v['spanish'].lower() == spanish.lower() and
                v['german'].lower() == german.lower()):
                print(f"Achtung! Diese Vokabel existiert bereits:\n"
                      f"  Spanisch: {v['spanish']} | Deutsch: {v['german']}")
                dup_choice = input("Trotzdem eintragen? (y/n): ").strip().lower()
                if dup_choice != 'y':
                    print("Vorgang abgebrochen. Vokabel wird nicht hinzugefügt.")
                    duplicate_found = True
                break

        if duplicate_found:
            continue  # Zur Eingabeschleife zurück

        # Speichern
        with open(CSV_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["german", "spanish", "chapter", "box"])
            writer.writerow(new_vocab)
        print(f"Vokabel '{spanish} - {german}' wurde hinzugefügt.")

def quiz():
    """
    Abfrage mit Kapitelauswahl, Box-Auswahl, Anzahl und Richtung.
    Deutsch->Spanisch: exakter String-Vergleich (case-insensitive).
    Spanisch->Deutsch: artikelignorierender Vergleich (case-insensitive).
    Mehrere deutsche Bedeutungen (Komma-getrennt): Eine reicht als richtige Antwort.
    """
    vocab_list = load_vocab()
    if not vocab_list:
        print("Keine Vokabeln vorhanden.")
        return

    chapters = sorted(set(v["chapter"] for v in vocab_list))
    print("\nVerfügbare Kapitel:", ", ".join(chapters))
    selected_chapter = input("Kapitel (oder 'alle'): ").strip()
    if selected_chapter.lower() == 'q':
        return
    if selected_chapter.lower() != "alle":
        vocab_list = [v for v in vocab_list if v["chapter"].lower() == selected_chapter.lower()]
        if not vocab_list:
            print(f"Keine Vokabeln zu Kapitel '{selected_chapter}'.")
            return

    boxes = sorted(set(v["box"] for v in vocab_list))
    print("Verfügbare Boxen:", ", ".join(str(b) for b in boxes))
    selected_box = input("Box (oder 'alle'): ").strip()
    if selected_box.lower() == 'q':
        return
    if selected_box.lower() != "alle":
        try:
            box_num = int(selected_box)
            vocab_list = [v for v in vocab_list if v["box"] == box_num]
            if not vocab_list:
                print(f"Keine Vokabeln in Box {box_num}.")
                return
        except ValueError:
            return

    try:
        num = int(input("Anzahl Vokabeln? (oder 'q'): "))
    except:
        return
    if num > len(vocab_list):
        num = len(vocab_list)

    print("Abfragerichtung:\n1) Deutsch -> Spanisch\n2) Spanisch -> Deutsch")
    direction_choice = input("(oder 'q'): ").strip()
    if direction_choice.lower() == 'q':
        return
    if direction_choice == "2":
        prompt_lang, answer_lang = "spanish", "german"
        answer_is_german = True
    else:
        prompt_lang, answer_lang = "german", "spanish"
        answer_is_german = False

    # Auswahl der Vokabeln
    selected = random.sample(vocab_list, k=num)

    correct_list = []
    incorrect_list = []

    # 1. Runde: normale Abfrage
    for vocab in selected:
        ask = vocab[prompt_lang]
        print(f"\nÜbersetze: {ask} ('q' für Abbruch)")
        user_input = input().strip()
        if user_input.lower() == 'q':
            print("Abbruch.")
            break

        correct_text = vocab[answer_lang]
        if check_answer(user_input, correct_text, language_is_german=answer_is_german):
            print("Richtig!")
            vocab["box"] += 1
            correct_list.append(vocab)
        else:
            print(f"Falsch. Richtig: {correct_text}")
            incorrect_list.append(vocab)

    # Zusammenfassung der 1. Runde
    print("\nAbfrage beendet.")
    print(f"Richtig beantwortet:   {len(correct_list)}")
    print(f"Falsch beantwortet:    {len(incorrect_list)}")

    # Optional: Falsche Vokabeln erneut üben
    if incorrect_list:
        retry_choice = input("\nFalsche Vokabeln erneut üben? (y/n): ").strip().lower()
        if retry_choice == 'y':
            # 2. Runde: Nur falsche abfragen
            # (gleiche Abfragerichtung, kein erneutes Kapitel/Box-Auswahl)
            second_correct_list = []
            second_incorrect_list = []

            print("\n--- Erneute Abfrage der falschen Vokabeln ---")
            for vocab in incorrect_list:
                ask = vocab[prompt_lang]
                print(f"\nÜbersetze: {ask} ('q' für Abbruch)")
                user_input = input().strip()
                if user_input.lower() == 'q':
                    print("Abbruch.")
                    break

                correct_text = vocab[answer_lang]
                if check_answer(user_input, correct_text, language_is_german=answer_is_german):
                    print("Richtig!")
                    vocab["box"] += 1
                    second_correct_list.append(vocab)
                else:
                    print(f"Falsch. Richtig: {correct_text}")
                    second_incorrect_list.append(vocab)

            print("\nErneute Abfrage beendet.")
            print(f"Richtig beantwortet: {len(second_correct_list)}")
            print(f"Falsch beantwortet:  {len(second_incorrect_list)}")

    # Nach Ende evtl. geänderter Box-Stufen: Speichern
    all_vocabs = load_vocab()
    # In selected + (optional) falsche_Liste haben wir veränderte Box-Stufen
    # => updaten wir an allen betroffenen.
    for vocab_item in selected + incorrect_list:
        for i, original in enumerate(all_vocabs):
            if (original["spanish"] == vocab_item["spanish"] and
                    original["german"] == vocab_item["german"] and
                    original["chapter"] == vocab_item["chapter"]):
                all_vocabs[i]["box"] = vocab_item["box"]

    # ACHTUNG: Falls du second_incorrect_list etc. anpassen willst,
    # musst du sie auch in all_vocabs übertragen.
    # Hier haben wir: `incorrect_list` enthält dieselben Objekte,
    # so dass du sie nicht einzeln noch einmal updaten musst –
    # insofern reicht es, am Ende ALLE betroffenen Vokabeln
    # (selected + incorrect_list) einmal zu durchsuchen.

    save_vocab(all_vocabs)
    print("Box-Stufen aktualisiert.\n")


def edit_vocabulary():
    """
    Bearbeiten bestehender Vokabeln (z.B. bei Tippfehlern).
    Suche nach Wort, Auswahl eines Treffers, dann Felder ändern.
    """
    vocab_list = load_vocab()
    if not vocab_list:
        print("Keine Vokabeln vorhanden. Bitte zuerst Vokabeln hinzufügen.")
        return

    print("\n--- Vokabeln bearbeiten ---")
    print("Gib 'q' ein, um zum Hauptmenü zurückzukehren.")
    search_term = input("Nach welchem Wort (Spanisch oder Deutsch) soll gesucht werden? ").strip()
    if search_term.lower() == 'q':
        return

    matches = [
        (i, v) for i, v in enumerate(vocab_list)
        if (v["german"].lower() == search_term.lower() or
            v["spanish"].lower() == search_term.lower())
    ]

    if not matches:
        print(f"Keine Vokabeln gefunden, die '{search_term}' entsprechen.")
        return

    print("\nGefundene Vokabeln:")
    for idx, (real_index, vocab) in enumerate(matches):
        print(f"{idx+1}) Spanisch: {vocab['spanish']} | Deutsch: {vocab['german']} "
              f"| Kapitel: {vocab['chapter']} | Box: {vocab['box']}")

    print("Gib 'q' ein, um zum Hauptmenü zurückzukehren.")
    choice_input = input("Welche Vokabel möchtest du bearbeiten? (Nummer) ").strip()
    if choice_input.lower() == 'q':
        return

    try:
        chosen_idx = int(choice_input) - 1
        if chosen_idx < 0 or chosen_idx >= len(matches):
            print("Ungültige Auswahl.")
            return
    except ValueError:
        print("Bitte eine gültige Nummer eingeben.")
        return

    real_index, chosen_vocab = matches[chosen_idx]

    old_spanish = chosen_vocab["spanish"]
    old_german = chosen_vocab["german"]
    old_chapter = chosen_vocab["chapter"]
    old_box = chosen_vocab["box"]

    print("\nGib neue Werte ein oder drücke Enter, um den alten Wert zu behalten.")
    new_spanish = input(f"Spanisches Wort (alt: {old_spanish}): ").strip()
    new_german = input(f"Deutsches Wort (alt: {old_german}): ").strip()
    new_chapter = input(f"Kapitel (alt: {old_chapter}): ").strip()
    new_box = input(f"Box (alt: {old_box}): ").strip()

    if new_spanish == "":
        new_spanish = old_spanish
    if new_german == "":
        new_german = old_german
    if new_chapter == "":
        new_chapter = old_chapter
    if new_box == "":
        new_box = str(old_box)

    try:
        new_box_int = int(new_box)
    except ValueError:
        print("Box muss eine ganze Zahl sein. Änderung abgebrochen.")
        return

    # Update in Liste
    vocab_list[real_index]["spanish"] = new_spanish
    vocab_list[real_index]["german"] = new_german
    vocab_list[real_index]["chapter"] = new_chapter
    vocab_list[real_index]["box"] = new_box_int

    save_vocab(vocab_list)
    print("\nÄnderungen gespeichert.")

def show_box_overview():
    """
    Zeigt, wie viele Vokabeln sich in welcher Box befinden.
    Beispielausgabe:
      Box 1: 12 Vokabeln
      Box 2: 5 Vokabeln
      usw.
    """
    vocab_list = load_vocab()
    if not vocab_list:
        print("Keine Vokabeln vorhanden.")
        return

    box_counts = {}
    for v in vocab_list:
        box_counts[v["box"]] = box_counts.get(v["box"], 0) + 1

    print("\n--- Übersicht über alle Boxen ---")
    for box_num in sorted(box_counts.keys()):
        count = box_counts[box_num]
        print(f"Box {box_num}: {count} Vokabel(n)")
    print("--------------------------------")

def search_vocabulary():
    """
    Erlaubt dem Nutzer wiederholt nach Vokabeln zu suchen (Teilsuche),
    bis mit 'q' abgebrochen wird.
    Gesucht wird in Spanisch und Deutsch, case-insensitive, Teilstringsuche.
    """
    vocab_list = load_vocab()
    if not vocab_list:
        print("Keine Vokabeln vorhanden. Bitte zuerst Vokabeln hinzufügen.")
        return

    print("\n--- Vokabeln suchen ---")
    print("Gib 'q' ein, um zum Hauptmenü zurückzukehren.")

    while True:
        search_term = input("Suchbegriff (Deutsch oder Spanisch): ").strip()
        if search_term.lower() == 'q':
            break  # Zurück zum Hauptmenü

        search_term_lower = search_term.lower()
        # Teilstring-Suche in spanish oder german
        matches = [
            v for v in vocab_list
            if (search_term_lower in v["spanish"].lower()) or (search_term_lower in v["german"].lower())
        ]

        if not matches:
            print(f"Keine Vokabeln gefunden, die '{search_term}' enthalten.")
        else:
            print("\nGefundene Vokabeln:")
            for vocab in matches:
                print(f"  Spanisch: {vocab['spanish']}\n"
                      f"  Deutsch:  {vocab['german']}\n"
                      f"  Kapitel:  {vocab['chapter']} | Box: {vocab['box']}\n")
        print("--- Suche erneut oder 'q' zum Beenden ---")

def show_zeiten_indikativ_detail():
    tenses = [
        {
            "name": "Presente (Präsens)",
            "conj": {
                "hablar": ["hablo","hablas","habla","hablamos","habláis","hablan"],
                "aprender": ["aprendo","aprendes","aprende","aprendemos","aprendéis","aprenden"],
                "vivir": ["vivo","vives","vive","vivimos","vivís","viven"],
            },
            "usage": [
                "Handlung in der Gegenwart",
                "Handlung, die früher begann und bis jetzt dauert",
                "zukünftige Handlung (nur mit Zeitangabe)",
            ]
        },
        {
            "name": "Pretérito perfecto (Perfekt)",
            "conj": {
                "hablar": ["he hablado","has hablado","ha hablado","hemos hablado","habéis hablado","han hablado"],
                "aprender": ["he aprendido","has aprendido","ha aprendido","hemos aprendido","habéis aprendido","han aprendido"],
                "vivir": ["he vivido","has vivido","ha vivido","hemos vivido","habéis vivido","han vivido"],
            },
            "usage": [
                "abgeschlossene Handlung in einem Zeitraum, der noch zur Gegenwart zählt",
                "abgeschlossene Handlung, die Einfluss auf die Gegenwart hat",
            ]
        },
        {
            "name": "Pretérito indefinido (Präteritum)",
            "conj": {
                "hablar": ["hablé","hablaste","habló","hablamos","hablasteis","hablaron"],
                "aprender": ["aprendí","aprendiste","aprendió","aprendimos","aprendisteis","aprendieron"],
                "vivir": ["viví","viviste","vivió","vivimos","vivisteis","vivieron"],
            },
            "usage": [
                "abgeschlossene Handlung in der Vergangenheit ohne Einfluss auf die Gegenwart",
                "neue Handlung, die eine laufende Handlung unterbricht",
            ]
        },
        {
            "name": "Pretérito imperfecto (Verlaufsform)",
            "conj": {
                "hablar": ["hablaba","hablabas","hablaba","hablábamos","hablabais","hablaban"],
                "aprender": ["aprendía","aprendías","aprendía","aprendíamos","aprendíais","aprendían"],
                "vivir": ["vivía","vivías","vivía","vivíamos","vivíais","vivían"],
            },
            "usage": [
                "Beschreibung einer Situation in der Vergangenheit",
                "gewohnheitsmäßige Handlung",
                "Verlaufsbetonung",
            ]
        },
        {
            "name": "Pretérito pluscuamperfecto (Plusquamperfekt)",
            "conj": {
                "hablar": ["había hablado","habías hablado","había hablado","habíamos hablado","habíais hablado","habían hablado"],
                "aprender": ["había aprendido","habías aprendido","había aprendido","habíamos aprendido","habíais aprendido","habían aprendido"],
                "vivir": ["había vivido","habías vivido","había vivido","habíamos vivido","habíais vivido","habían vivido"],
            },
            "usage": [
                "Handlung, die vor einer anderen Handlung in der Vergangenheit stattfand",
            ]
        },
        {
            "name": "Pretérito anterior",
            "conj": {
                "hablar": ["hube hablado","hubiste hablado","hubo hablado","hubimos hablado","hubisteis hablado","hubieron hablado"],
                "aprender": ["hube aprendido","hubiste aprendido","hubo aprendido","hubimos aprendido","hubisteis aprendido","hubieron aprendido"],
                "vivir": ["hube vivido","hubiste vivido","hubo vivido","hubimos vivido","hubisteis vivido","hubieron vivido"],
            },
            "usage": [
                "nur noch in der literarischen Sprache",
                "unmittelbar vor einer anderen Handlung",
            ]
        },
        {
            "name": "Futuro simple (Futur I)",
            "conj": {
                "hablar": ["hablaré","hablarás","hablará","hablaremos","hablaréis","hablarán"],
                "aprender": ["aprenderé","aprenderás","aprenderá","aprenderemos","aprenderéis","aprenderán"],
                "vivir": ["viviré","vivirás","vivirá","viviremos","viviréis","vivirán"],
            },
            "usage": [
                "Handlung/Zustand in der Zukunft",
                "Vermutung über Gegenwart/Zukunft",
            ]
        },
        {
            "name": "Futuro compuesto (Futur II)",
            "conj": {
                "hablar": ["habré hablado","habrás hablado","habrá hablado","habremos hablado","habréis hablado","habrán hablado"],
                "aprender": ["habré aprendido","habrás aprendido","habrá aprendido","habremos aprendido","habréis aprendido","habrán aprendido"],
                "vivir": ["habré vivido","habrás vivido","habrá vivido","habremos vivido","habréis vivido","habrán vivido"],
            },
            "usage": [
                "Vermutung über abgeschlossene Handlung",
                "bis zu einem Zeitpunkt in der Zukunft abgeschlossen",
            ]
        },
        {
            "name": "Condicional simple",
            "conj": {
                "hablar": ["hablaría","hablarías","hablaría","hablaríamos","hablaríais","hablarían"],
                "aprender": ["aprendería","aprenderías","aprendería","aprenderíamos","aprenderíais","aprenderían"],
                "vivir": ["viviría","vivirías","viviría","viviríamos","viviríais","vivirían"],
            },
            "usage": [
                "Einladung, Bitte, Wunsch, Anregung oder Vorschlag",
                "Wahrscheinlichkeit, Hypothese",
                "Zweifel in der Vergangenheit",
                "zukünftige Handlung aus Sicht der Vergangenheit",
            ]
        },
        {
            "name": "Condicional compuesto",
            "conj": {
                "hablar": ["habría hablado","habrías hablado","habría hablado","habríamos hablado","habríais hablado","habrían hablado"],
                "aprender": ["habría aprendido","habrías aprendido","habría aprendido","habríamos aprendido","habríais aprendido","habrían aprendido"],
                "vivir": ["habría vivido","habrías vivido","habría vivido","habríamos vivido","habríais vivido","habrían vivido"],
            },
            "usage": [
                "abgeschlossene Einladung, Bitte, Wunsch, Anregung",
                "Vermutung in der Vergangenheit",
                "zukünftige Handlung aus Sicht der Vergangenheit",
            ]
        },
    ]

    for t in tenses:
        print(f"\n=== {t['name']} ===")
        for verb, forms in t["conj"].items():
            print(f"{verb:8}: " + ", ".join(forms))
        print("Anwendung:")
        for u in t["usage"]:
            print(f"  - {u}")
    print()  # Leerzeile am Ende


def show_zeiten_indikativ_menu():
    options = [
        "alle Zeiten",
        "Presente",
        "Estar + Gerundio",
        "Pretérito perfecto",
        "Pretérito imperfecto",
        "Pretérito indefinido",
        "Pretérito pluscuamperfecto",
        "Pretérito anterior",
        "ir a + Infinitiv",
        "Futuro simple",
        "Futuro compuesto",
        "Condicional simple",
        "Condicional compuesto",
    ]
    print("\n--- Zeiten Indikativ ---")
    for i, opt in enumerate(options, 1):
        print(f"{i}) {opt}")
    print("------------------------")
    choice = input("Auswahl (oder 'q'): ").strip().lower()
    if choice == "1":  # "alle Zeiten"
        show_zeiten_indikativ_detail()

    # hier ggf. auf choice reagieren und Detailinfos anzeigen
    print(f"Du hast gewählt: {choice} – Detailanzeige noch implementieren.")

def show_zeiten_subjuntivo_menu():
    options = [
        "Presente de Subjuntivo",
        "Pretérito imperfecto de Subjuntivo",
        "Pretérito perfecto de Subjuntivo",
        "Pluscuamperfecto de Subjuntivo",
        # … weitere Formen
    ]
    print("\n--- Zeiten Subjuntivo ---")
    for i, opt in enumerate(options, 1):
        print(f"{i}) {opt}")
    print("-------------------------")
    choice = input("Auswahl (oder 'q'): ").strip().lower()
    print(f"Du hast gewählt: {choice} – Detailanzeige noch implementieren.")

def grammar_menu():
    while True:
        print("\n--- Grammatik ---")
        print("1) Zeiten Indikativ")
        print("2) Zeiten Subjuntivo")
        print("q) Zurück")
        choice = input("Auswahl: ").strip().lower()
        if choice == "1":
            show_zeiten_indikativ_menu()
        elif choice == "2":
            show_zeiten_subjuntivo_menu()
        elif choice == "q":
            break
        else:
            print("Ungültige Auswahl.")


def main():
    ensure_csv_exists()
    while True:
        print("\n--- Hauptmenü ---")
        print("1) Neue Vokabeln eintragen")
        print("2) Vokabeln abfragen")
        print("3) Vokabeln bearbeiten")
        print("4) Vokabeln suchen")
        print("5) Übersicht über alle Boxen")
        print("6) Grammatik")
        print("7) Beenden (oder 'q')")

        choice = input("Auswahl: ").strip().lower()
        if choice in ["7", "q", "quit", "exit"]:
            print("Programm beendet.")
            sys.exit(0)

        elif choice == "1":
            add_vocabulary()

        elif choice == "2":
            quiz()

        elif choice == "3":
            edit_vocabulary()

        elif choice == "4":
            search_vocabulary()

        elif choice == "5":
            show_box_overview()

        elif choice == "6":
            grammar_menu()

        else:
            print("Ungültige Auswahl. Bitte erneut versuchen.")

if __name__ == "__main__":
    main()
