# ------------------------------------------------------------------------------
# Beispielskript mit Karteikastenfunktionen + GPT-API-Funktionen (Übersetzen & Konjugieren)
# ------------------------------------------------------------------------------
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
#       7) Spanisches Verb konjugieren (über GPT)
#       8) Übersetzungsfunktion (über GPT)
#
# 3) Beim Eintragen von Vokabeln (Punkt 1):
#    - Du wirst nach der spanischen Vokabel gefragt, dann nach der deutschen
#      (mehrere Bedeutungen per Komma möglich) und anschließend nach dem Kapitel.
#    - Mit 'q' kann jederzeit abgebrochen werden.
#    - Falls eine Vokabel (spanisch+deutsch) bereits existiert, kommt eine Warnung.
#
# 4) Beim Abfragen (Punkt 2):
#    - Du legst fest, ob du nur ein bestimmtes Kapitel oder alle Kapitel abfragen willst.
#    - Du wählst eine bestimmte Box oder 'alle'.
#    - Du gibst an, wie viele Vokabeln abgefragt werden sollen.
#    - Anschließend legst du die Richtung fest: Deutsch→Spanisch (1) oder Spanisch→Deutsch (2).
#      - Bei Spanisch→Deutsch werden einführende deutsche Artikel (der, die, das, ...) ignoriert.
#      - Mehrere deutsche Bedeutungen (kommagetrennt) sind möglich, eine richtige genügt.
#    - Richtige Antworten erhöhen die Box-Stufe, falsche bleiben in der aktuellen Box.
#
# 5) Beim Bearbeiten (Punkt 4):
#    - Du kannst nach einer Vokabel suchen und sie anpassen (z.B. bei Tippfehlern),
#      indem du Spanisch, Deutsch, Kapitel oder Box änderst.
#
# 6) Die Übersicht (Punkt 5) zeigt dir, wie viele Vokabeln aktuell in jeder Box sind.
#
# 7) Bei der Suche (Punkt 6):
#    - Du kannst beliebig oft einen Suchbegriff eingeben (bis 'q'), und es werden
#      alle Vokabeln aufgelistet, in deren spanischer oder deutscher Bezeichnung
#      dieser Teilstring vorkommt (case-insensitive).
#
# 8) Spanisches Verb konjugieren (Punkt 7):
#    - Du gibst ein spanisches Verb ein und erhältst die Konjugation (Indicativo,
#      Subjuntivo, Imperativo, usw.) mithilfe des GPT-Modells.
#
# 9) Übersetzungsfunktion (Punkt 8):
#    - Du wählst Quell- und Zielsprache (z.B. Deutsch nach Spanisch oder umgekehrt)
#      und gibst einen Text ein. Das GPT-Modell liefert dir eine Übersetzung zurück.
#
# 10) OpenAI-API-Schlüssel:
#    - Damit die Funktionen für Konjugation (7) und Übersetzung (8) über GPT
#      funktionieren, hast du in deinem Code
#
#         openai.api_key = "dein-geheimer-key"
#
#      ergänzt. Stelle sicher, dass dein Key korrekt ist und du ausreichend
#      Guthaben/hinterlegte Zahlungsdaten hast (abhängig von deinem OpenAI-Tarif).
#
# Viel Spaß beim Lernen!
# ------------------------------------------------------------------------------

import csv
import os
import random
import sys
import openai

# Stelle sicher, dass dein API Key bekannt ist, z.B.:
# export OPENAI_API_KEY="XY"
# oder:
# Stelle sicher, dass dein API Key bekannt ist, z.B.:
# export OPENAI_API_KEY="XY"
# oder:
openai.api_key = "YOUR_API_KEY_HERE"  # (nicht empfohlen, da Key im Code)



CSV_FILE = "../vocab.csv"

GERMAN_ARTICLES = {
    "der", "die", "das",
    "ein", "eine", "einen", "einem", "eines",
    "den", "dem", "des"
}

def ensure_csv_exists():
    """Erstellt die CSV-Datei, falls sie nicht existiert."""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["german", "spanish", "chapter", "box"])

def load_vocab():
    """Lädt alle Vokabeln als Liste von Dictionaries."""
    vocab_list = []
    with open(CSV_FILE, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["box"] = int(row["box"])
            vocab_list.append(row)
    return vocab_list

def save_vocab(vocab_list):
    """Schreibt die Liste zurück in vocab.csv."""
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        fieldnames = ["german", "spanish", "chapter", "box"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for v in vocab_list:
            writer.writerow(v)

def strip_german_article(phrase):
    words = phrase.lower().split()
    if words and words[0] in GERMAN_ARTICLES:
        return " ".join(words[1:])
    return " ".join(words)

def check_answer(user_input, correct_text, language_is_german):
    synonyms = [s.strip() for s in correct_text.split(",")]
    valid_answers = set()
    for syn in synonyms:
        syn_lower = syn.lower()
        if language_is_german:
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
    while True:
        print("\nNeue Vokabel (oder 'q' für Abbruch)")
        spanish = input("Spanisches Wort: ").strip()
        if spanish.lower() == 'q':
            break

        german = input("Deutsches Wort (ggf. mit Komma): ").strip()
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

        existing = load_vocab()
        # Duplicate check
        found_duplicate = any(
            v["spanish"].lower() == spanish.lower() and v["german"].lower() == german.lower()
            for v in existing
        )
        if found_duplicate:
            print("Achtung: Diese Vokabel scheint es schon zu geben.")
            choice = input("Trotzdem eintragen? (y/n): ").lower()
            if choice != 'y':
                continue

        with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["german","spanish","chapter","box"])
            w.writerow(new_vocab)
        print(f"Vokabel '{spanish} - {german}' hinzugefügt.")

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
    vocs = load_vocab()
    if not vocs:
        print("Keine Vokabeln vorhanden.")
        return
    term = input("\nWonach suchen? (ES oder DE, 'q' Abbruch): ").strip().lower()
    if term == 'q':
        return
    matches = [(i,v) for i,v in enumerate(vocs)
               if v["spanish"].lower() == term or v["german"].lower()==term]
    if not matches:
        print(f"Keine Treffer zu '{term}'.")
        return
    print("\nGefundene Vokabeln:")
    for idx,(real_i,vocab) in enumerate(matches):
        print(f"{idx+1}) ES:{vocab['spanish']} DE:{vocab['german']} Kap:{vocab['chapter']} Box:{vocab['box']}")
    choice_str = input("Welche Nummer bearbeiten? (oder 'q'): ").strip().lower()
    if choice_str=='q':
        return
    try:
        choice = int(choice_str)-1
        if choice<0 or choice>=len(matches):
            print("Ungültige Auswahl.")
            return
    except:
        print("Bitte Zahl eingeben.")
        return

    real_idx, chosen = matches[choice]
    old_sp,old_ge,old_ch,old_box = chosen["spanish"], chosen["german"], chosen["chapter"],chosen["box"]
    print("\nNeue Werte (Enter = alter Wert):")
    new_sp = input(f"Spanisch (alt:{old_sp}): ").strip()
    new_ge = input(f"Deutsch (alt:{old_ge}): ").strip()
    new_ch = input(f"Kapitel (alt:{old_ch}): ").strip()
    new_bx = input(f"Box (alt:{old_box}): ").strip()

    if new_sp=="": new_sp=old_sp
    if new_ge=="": new_ge=old_ge
    if new_ch=="": new_ch=old_ch
    if new_bx=="": new_bx=str(old_box)

    try:
        new_bx_int = int(new_bx)
    except:
        print("Box muss Zahl sein.")
        return

    vocs[real_idx]["spanish"] = new_sp
    vocs[real_idx]["german"]  = new_ge
    vocs[real_idx]["chapter"] = new_ch
    vocs[real_idx]["box"]     = new_bx_int

    save_vocab(vocs)
    print("Änderungen gespeichert.")

def show_box_overview():
    vocs = load_vocab()
    if not vocs:
        print("Keine Vokabeln vorhanden.")
        return
    box_counts = {}
    for v in vocs:
        box_counts[v["box"]] = box_counts.get(v["box"],0)+1
    print("\n--- Box-Übersicht ---")
    for b in sorted(box_counts.keys()):
        print(f"Box {b}: {box_counts[b]} Vokabel(n)")
    print("---------------------")

def search_vocabulary():
    vocs = load_vocab()
    if not vocs:
        print("Keine Vokabeln vorhanden.")
        return
    while True:
        term = input("\nSuchbegriff (Teilstring, 'q' Abbruch): ").strip().lower()
        if term=='q':
            break
        matches = [v for v in vocs if (term in v["spanish"].lower() or term in v["german"].lower())]
        if not matches:
            print(f"Keine Treffer für '{term}'.")
        else:
            print(f"{len(matches)} Treffer:")
            for m in matches:
                print(f"  ES:{m['spanish']} DE:{m['german']} Kap:{m['chapter']} Box:{m['box']}")

# ------------------------------------------------------------------------------
# NEU: GPT4o-mini / GPT-3.5 / GPT-4 - basierte Funktionen
# ------------------------------------------------------------------------------

def conjugate_spanish_verb_openai():
    """
    Fragt den Nutzer nach einem spanischen Verb und stellt eine Chat-Anfrage an GPT,
    wobei wir die Ausgabe klar und übersichtlich formatiert anfordern.
    """
    while True:
        verb = input("\nSpanisches Verb zum Konjugieren ('q' Abbruch): ").strip().lower()
        if verb == 'q':
            break
        if not verb:
            continue

        # Dieser Prompt fordert GPT auf, eine geordnete, gut lesbare Ausgabe zu liefern.
        system_prompt = (
            "Du bist ein Hilfsassistent, der spanische Verben konjugieren kann. "
            "Bitte antworte in einer klar strukturierten Form, mit Überschriften für "
            "die Modi (Indicativo, Subjuntivo, Imperativo) und Zwischenüberschriften "
            "für die einzelnen Zeitformen. Verwende Absätze oder Bullet Points für "
            "jede Person (yo, tú, etc.). Gib außerdem das Partizip und Gerundium an. "
            "Verwende keine zusätzlichen Erklärungen, sondern nur die reinen Formen. "
            "Beispielhafte Struktur:\n\n"
            "Indicativo\n"
            "  - Presente:\n"
            "    * yo hablo\n"
            "    * tú hablas\n"
            "  - Pretérito perfecto simple:\n"
            "    ...\n\n"
            "Subjuntivo\n"
            "  - Presente:\n"
            "    ...\n\n"
            "Imperativo\n"
            "  - Afirmativo:\n"
            "    ...\n\n"
            "Partizip:\n"
            "  - hablado\n"
            "Gerundio:\n"
            "  - hablando\n\n"
            "Bitte liefere das Ergebnis ohne weitere Kommentare."
        )

        # Der User-Prompt: Konjugiere dieses Verb.
        user_prompt = f"Konjugiere das spanische Verb '{verb}' in allen gebräuchlichen Formen."

        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",  # oder "gpt-3.5-turbo" / "GPT4o-mini"
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2
            )
            ans = response["choices"][0]["message"]["content"].strip()

            print("\n--- Konjugation ---")
            print(ans)
            print("-------------------")

        except Exception as e:
            print("Fehler bei OpenAI-API:", e)
def translate_with_openai():
    """
    Einfache Übersetzungsfunktion via GPT-3.5/4.
    Fragt nach Quell- und Zielsprache, sowie Text zum Übersetzen.
    """
    while True:
        src_lang = input("\nAusgangssprache (z.B. 'Deutsch', 'Spanisch', 'q' Abbruch): ").strip().lower()
        if src_lang == 'q':
            break
        if not src_lang:
            src_lang = "Deutsch"

        dst_lang = input("Zielsprache (z.B. 'Spanisch', 'Deutsch'): ").strip().lower()
        if dst_lang == 'q':
            break
        if not dst_lang:
            dst_lang = "Spanisch"

        text = input("Zu übersetzender Text (oder 'q' Abbruch): ").strip()
        if text.lower() == 'q':
            break

        # Construct the prompt
        system_prompt = (
            f"Du bist ein Übersetzer, der von {src_lang} nach {dst_lang} übersetzt. "
            "Gib bitte nur die Übersetzung aus, ohne weitere Erklärungen."
        )
        user_prompt = text

        try:
            # OpenAI Chat API Call
            response = openai.ChatCompletion.create(
                model="gpt-4",  # or "gpt-3.5-turbo"
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2
            )
            ans = response["choices"][0]["message"]["content"].strip()
            print(f"\nÜbersetzung ({src_lang}->{dst_lang}): {ans}")

        except Exception as e:
            print("Fehler bei OpenAI-API:", e)

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

#-------------------------------------------------------------------------------
# Grammatik-Menü (Dummy-Funktion)
# ------------------------------------------------------------------------------
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
    # hier ggf. auf choice reagieren und Detailinfos anzeigen
    if choice == "1":  # "alle Zeiten"
        show_zeiten_indikativ_detail()

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

# ------------------------------------------------------------------------------
# Hauptmenü
# ------------------------------------------------------------------------------
def main():
    ensure_csv_exists()

    while True:
        print("\n--- Hauptmenü ---")
        print("1) Neue Vokabeln eintragen")
        print("2) Vokabeln abfragen")
        print("3) Vokabeln bearbeiten")
        print("4) Übersicht Boxen")
        print("5) Vokabeln suchen")
        print("6) Spanisches Verb konjugieren (GPT4o-mini)")
        print("7) Übersetzen (GPT4o-mini)")
        print("8) Grammatik")
        print("9) Beenden (oder 'q')")

        choice = input("Auswahl: ").strip().lower()
        if choice in ["9","q","quit","exit"]:
            print("Programm beendet.")
            sys.exit(0)
        elif choice=="1":
            add_vocabulary()
        elif choice=="2":
            quiz()
        elif choice=="3":
            edit_vocabulary()
        elif choice=="4":
            show_box_overview()
        elif choice=="5":
            search_vocabulary()
        elif choice=="6":
            conjugate_spanish_verb_openai()
        elif choice=="7":
            translate_with_openai()
        elif choice=="8":
            grammar_menu()
        else:
            print("Ungültige Auswahl.")

if __name__=="__main__":
    main()
