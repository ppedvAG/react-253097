// Import der zentralen Helfer von React Testing Library:
// - render: zum Rendern einer Komponente in einer isolierten Testumgebung
// - screen: für bequeme Abfragen im gerenderten DOM (statt container.querySelector)
// - fireEvent: um DOM-Events wie Klicks oder Eingaben zu simulieren
import { render, screen, fireEvent } from "@testing-library/react";

// Import der Jest-DOM-Erweiterungen (z. B. toBeInTheDocument, toHaveTextContent).
// Diese sorgen dafür, dass expect(...) um DOM-spezifische Matcher erweitert wird.
import "@testing-library/jest-dom";

// Import der zu testenden Komponente.
// ReactFormsExample kapselt SimpleForm und die Anzeige der zuletzt gesendeten Daten.
import { ReactFormsExample } from "./ReactFormsExample";

/* ============================================================================
 * Test-Suite für ReactFormsExample
 * ----------------------------------------------------------------------------
 * Diese Tests decken das Verhalten des Formulars ab:
 * - Initialer Zustand ohne Fehler
 * - Validierungsfehler bei leerem Submit
 * - Validierungsfehler bei zu kurzem Namen
 * - Erfolgreicher Submit und Anzeige der zuletzt gesendeten Daten
 * ========================================================================= */

// Öffnet eine Test-Suite mit beschreibendem Namen.
describe("ReactFormsExample (Formular mit react-hook-form)", () => {
  /* -------------------------------------------------------------------------
   * Test 1: Initialer Zustand des Formulars
   * ------------------------------------------------------------------------
   * Ziel:
   * - Überprüfen, dass alle relevanten UI-Elemente vorhanden sind:
   *   - Formular-Titel
   *   - Eingabefelder für Name und Lieblingsfarbe
   *   - Submit-Button
   * - Sicherstellen, dass beim ersten Render noch keine Fehlermeldungen
   *   und keine Status-/Infomeldungen angezeigt werden.
   * ---------------------------------------------------------------------- */
  test("zeigt initial das Formular ohne Fehlermeldungen an", () => {
    // Rendert die komplette ReactFormsExample-Komponente in der Testumgebung.
    render(<ReactFormsExample />);

    // Sucht die Hauptüberschrift des Formulars per Rolle "heading" und
    // dem sichtbaren Text "Einfaches Formular".
    const title = screen.getByRole("heading", {
      level: 1,
      name: /einfaches formular/i,
    });

    // Sucht das Texteingabefeld für den Namen über das zugehörige Label.
    // getByLabelText nutzt die Verbindung via <label htmlFor="...">.
    const nameInput = screen.getByLabelText(/name/i);

    // Sucht das Texteingabefeld für die Lieblingsfarbe über das zugehörige Label.
    const colorInput = screen.getByLabelText(/lieblingsfarbe/i);

    // Sucht den Submit-Button mit der Beschriftung "Senden".
    const submitButton = screen.getByRole("button", { name: /senden/i });

    // Erwartung: Die Überschrift ist vorhanden.
    expect(title).toBeInTheDocument();
    // Erwartung: Das Name-Eingabefeld ist vorhanden.
    expect(nameInput).toBeInTheDocument();
    // Erwartung: Das Lieblingsfarbe-Eingabefeld ist vorhanden.
    expect(colorInput).toBeInTheDocument();
    // Erwartung: Der Senden-Button ist vorhanden.
    expect(submitButton).toBeInTheDocument();

    // Sucht nach einer typischen Fehlermeldung im initialen Zustand.
    // queryByText gibt NULL zurück, wenn nichts gefunden wird (im Gegensatz zu getByText, das Fehler wirft).
    const nameError = screen.queryByText(/name ist erforderlich\./i);
    const colorError = screen.queryByText(/lieblingsfarbe ist erforderlich\./i);

    // Erwartung: Es gibt initial keine Fehlermeldung für den Namen.
    expect(nameError).toBeNull();
    // Erwartung: Es gibt initial keine Fehlermeldung für die Lieblingsfarbe.
    expect(colorError).toBeNull();

    // Sucht nach der Infozeile "Zuletzt gesendet: ...", die nur erscheinen soll,
    // wenn bereits ein Submit erfolgreich war.
    const lastSubmittedInfo = screen.queryByText(/zuletzt gesendet:/i);

    // Erwartung: Diese Info ist initial noch nicht vorhanden.
    expect(lastSubmittedInfo).toBeNull();
  });

  /* -------------------------------------------------------------------------
   * Test 2: Leer-Submit -> Validierungsfehler für beide Felder
   * ------------------------------------------------------------------------
   * Ziel:
   * - Wenn der Benutzer ohne Eingabe auf "Senden" klickt,
   *   sollen Validierungsfehler für beide Felder erscheinen.
   * - Zusätzlich soll die Statusmeldung für ungültige Eingaben angezeigt werden.
   * ---------------------------------------------------------------------- */
  test("zeigt Fehlermeldungen, wenn ohne Eingaben gesendet wird", async () => {
    // Wieder: die gesamte Komponente rendern.
    render(<ReactFormsExample />);

    // Den Senden-Button über seine Beschriftung suchen.
    const submitButton = screen.getByRole("button", { name: /senden/i });

    // Klick auf den Senden-Button simulieren.
    // Dadurch wird:
    // - handleClickSubmitButton ausgeführt (Statusmeldung auf 'Absenden wurde geklickt...').
    // - handleSubmit von react-hook-form ausgeführt, das bei ungültiger Eingabe
    //   onInvalidSubmit aufruft (Statusmeldung auf 'Bitte korrigieren...' + Fehlermeldungen).
    fireEvent.click(submitButton);

    // Da Validierung / State-Updates asynchron sein können, verwenden wir findByText,
    // das wartet, bis das entsprechende Element im DOM auftaucht (oder ein Timeout erreicht).
    const nameError = await screen.findByText(/name ist erforderlich\./i);
    const colorError = await screen.findByText(
      /lieblingsfarbe ist erforderlich\./i
    );

    // Erwartung: Fehlermeldung für das leere Name-Feld ist sichtbar.
    expect(nameError).toBeInTheDocument();
    // Erwartung: Fehlermeldung für das leere Lieblingsfarbe-Feld ist sichtbar.
    expect(colorError).toBeInTheDocument();

    // Zusätzlich sollte die allgemeine Statusmeldung für ungültigen Submit angezeigt werden.
    const statusMessage = screen.getByText(
      /bitte korrigieren sie die markierten felder\./i
    );

    // Erwartung: Die Statusmeldung ist im Dokument.
    expect(statusMessage).toBeInTheDocument();

    // Sicherstellen, dass die Infozeile zu zuletzt gesendeten Daten weiterhin fehlt,
    // da noch kein erfolgreicher Submit stattgefunden hat.
    const lastSubmittedInfo = screen.queryByText(/zuletzt gesendet:/i);
    expect(lastSubmittedInfo).toBeNull();
  });

  /* -------------------------------------------------------------------------
   * Test 3: Name zu kurz -> MinLength-Fehler
   * ------------------------------------------------------------------------
   * Ziel:
   * - Wenn der Name weniger als 2 Zeichen hat, soll die MinLength-Fehlermeldung
   *   für das Namensfeld erscheinen.
   * - Das Lieblingsfarbe-Feld ist in diesem Szenario gültig und sollte
   *   daher keine Fehlermeldung anzeigen.
   * ---------------------------------------------------------------------- */
  test("zeigt MinLength-Fehler, wenn der Name zu kurz ist", async () => {
    // Komponente rendern
    render(<ReactFormsExample />);

    // Eingabefelder für Name und Lieblingsfarbe per Label holen.
    const nameInput = screen.getByLabelText(/name/i);
    const colorInput = screen.getByLabelText(/lieblingsfarbe/i);

    // Senden-Button holen.
    const submitButton = screen.getByRole("button", { name: /senden/i });

    // In das Namensfeld nur ein Zeichen eingeben (zu kurz, da minLength = 2).
    // fireEvent.change simuliert ein onChange-Event mit einem neuen Value.
    fireEvent.change(nameInput, { target: { value: "A" } });

    // In das Lieblingsfarbe-Feld einen gültigen Wert eingeben.
    fireEvent.change(colorInput, { target: { value: "Blau" } });

    // Jetzt Submit auslösen.
    fireEvent.click(submitButton);

    // Die MinLength-Fehlermeldung für das Namensfeld abwarten.
    const nameMinLengthError = await screen.findByText(
      /name muss mindestens 2 zeichen lang sein\./i
    );

    // Erwartung: Die MinLength-Fehlermeldung für den Namen ist sichtbar.
    expect(nameMinLengthError).toBeInTheDocument();

    // Für die Lieblingsfarbe sollte es in diesem Szenario KEINE Fehlermeldung geben,
    // da das Feld gültig ausgefüllt wurde.
    const colorError = screen.queryByText(
      /lieblingsfarbe ist erforderlich\./i
    );
    expect(colorError).toBeNull();

    // Die allgemeine Statusmeldung für ungültigen Submit sollte angezeigt werden.
    const statusMessage = screen.getByText(
      /bitte korrigieren sie die markierten felder\./i
    );
    expect(statusMessage).toBeInTheDocument();

    // Auch hier: Noch kein erfolgreicher Submit -> keine "Zuletzt gesendet"-Info.
    const lastSubmittedInfo = screen.queryByText(/zuletzt gesendet:/i);
    expect(lastSubmittedInfo).toBeNull();
  });

  /* -------------------------------------------------------------------------
   * Test 4: Erfolgreicher Submit mit gültigen Daten
   * ------------------------------------------------------------------------
   * Ziel:
   * - Beide Felder werden mit gültigen Werten ausgefüllt.
   * - Nach Klick auf "Senden" soll:
   *   - die Erfolgs-Statusmeldung angezeigt werden.
   *   - die Parent-Komponente lastSubmittedData setzen.
   *   - die Infozeile "Zuletzt gesendet: ..." mit den korrekten Werten erscheinen.
   *   - keine Fehlermeldungen mehr sichtbar sein.
   * ---------------------------------------------------------------------- */
  test("sendet Formular erfolgreich und zeigt zuletzt gesendete Daten an", async () => {
    // Komponente rendern
    render(<ReactFormsExample />);

    // Eingabefelder holen.
    const nameInput = screen.getByLabelText(/name/i);
    const colorInput = screen.getByLabelText(/lieblingsfarbe/i);

    // Senden-Button holen.
    const submitButton = screen.getByRole("button", { name: /senden/i });

    // Beide Felder mit gültigen Werten befüllen.
    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(colorInput, { target: { value: "Blau" } });

    // Submit auslösen.
    fireEvent.click(submitButton);

    // Die Erfolgs-Statusmeldung abwarten.
    const successMessage = await screen.findByText(
      /formular erfolgreich gesendet!/i
    );

    // Erwartung: Die Erfolgsnachricht ist sichtbar.
    expect(successMessage).toBeInTheDocument();

    // Jetzt sollte die Parent-Komponente lastSubmittedData gesetzt haben
    // und die Infozeile "Zuletzt gesendet: ..." anzeigen.
    const lastSubmittedInfo = screen.getByText(/zuletzt gesendet:/i);

    // Erwartung: Die Infozeile ist vorhanden.
    expect(lastSubmittedInfo).toBeInTheDocument();

    // Zusätzlich prüfen wir, dass die konkreten Werte im Text erscheinen:
    // "Alice (Lieblingsfarbe: Blau)"
    expect(lastSubmittedInfo).toHaveTextContent("Alice");
    expect(lastSubmittedInfo).toHaveTextContent("Lieblingsfarbe: Blau");

    // Sicherstellen, dass für diesen erfolgreichen Fall keine Fehlermeldungen
    // mehr angezeigt werden.
    const nameError = screen.queryByText(/name ist erforderlich\./i);
    const colorRequiredError = screen.queryByText(
      /lieblingsfarbe ist erforderlich\./i
    );
    const nameMinLengthError = screen.queryByText(
      /name muss mindestens 2 zeichen lang sein\./i
    );

    expect(nameError).toBeNull();
    expect(colorRequiredError).toBeNull();
    expect(nameMinLengthError).toBeNull();
  });
});
