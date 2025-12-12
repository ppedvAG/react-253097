// Komponententests / Integrationstests

// Importiert Hilfsfunktionen aus React Testing Library:
// - render: um eine Komponente in einer Testumgebung zu rendern
// - screen: um nach Elementen im gerenderten DOM zu suchen
// - fireEvent: um DOM-Events (z. B. Klicks) zu simulieren
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactComponentsExample } from "./ReactComponentsExample";

// Definiert eine Funktion, die nach jedem einzelnen Test ausgeführt wird.
afterEach(() => {
  // Setzt alle mit jest.spyOn oder jest.mock erzeugten Mocks und Spies zurück,
  // damit Tests unabhängig voneinander bleiben und keine Seiteneffekte entstehen.
  // Spies -> beobachtet vorhandene Funktion 
  // Mocks -> künstlich (ersetzte) Implementierung einer Funktion 
  jest.restoreAllMocks();
});

// Öffnet eine Test-Suite mit dem Namen "ReactComponentsExample".
// Alle Tests innerhalb dieses Blocks beziehen sich auf diese Komponente.
describe("ReactComponentsExample", () => {
  // Definiert einen Testfall mit einer beschreibenden Zeichenkette.
  // Dieser Test prüft, ob die Hauptüberschrift korrekt gerendert wird.
  test("rendert Hauptüberschrift 'React Components Demo'", () => {
    // Rendert die ReactComponentsExample-Komponente innerhalb der Testumgebung.
    // Dadurch steht das erzeugte DOM über 'screen' für Abfragen zur Verfügung.
    render(<ReactComponentsExample />);

    // Sucht im gerenderten DOM nach einer Überschrift (role = "heading") mit Level 1 (h1)
    // und einem Text, der auf "React Components Demo" passt (case-insensitive durch /i).
    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /react components demo/i, 
      // Regex -> /... Suchmuster .../
      // i -> case-sensitive
    });

    // Erwartet, dass die gefundene Überschrift im Dokument vorhanden ist.
    // Dieser Matcher kommt aus "@testing-library/jest-dom".
    expect(mainHeading).toBeInTheDocument();
  });

  // Definiert einen weiteren Testfall.
  // Dieser Test prüft, ob die UserList mit Titel "Team" und genau drei User-Einträgen gerendert wird.
  test("rendert UserList mit Titel 'Team' und drei Einträgen", () => {
    // Rendert erneut die ReactComponentsExample-Komponente,
    // diesmal mit Fokus auf die UserList.
    render(<ReactComponentsExample />);

    // Sucht nach einer Überschrift (role = "heading") mit Level 2 (h2)
    // und dem Text "Team".
    const listHeading = screen.getByRole("heading", {
      level: 2,
      name: /team/i,
    });
    // Erwartet, dass die Liste-Überschrift mit dem Titel "Team" im Dokument ist.
    expect(listHeading).toBeInTheDocument();

    // Sammelt alle Listeneinträge (<li>-Elemente) aus dem gerenderten DOM.
    // Diese Einträge sollten den Inhalt der UserList darstellen.
    const items = screen.getAllByRole("listitem");

    // Erwartet, dass genau drei Listenelemente vorhanden sind,
    // entsprechend der drei initial definierten Users (Alice, Bob, Charlie).
    expect(items).toHaveLength(3);

    // Erwartet, dass das erste Listen-Element den Text "Alice (Developer)" enthält.
    expect(items[0]).toHaveTextContent("Alice (Developer)");
    // Erwartet, dass das zweite Listen-Element den Text "Bob (Designer)" enthält.
    expect(items[1]).toHaveTextContent("Bob (Designer)");
    // Erwartet, dass das dritte Listen-Element den Text "Charlie (Product Owner)" enthält.
    expect(items[2]).toHaveTextContent("Charlie (Product Owner)");
  });

  // Definiert einen Test für den Counter-Teil der Komponente.
  // Dieser Test prüft, ob der Counter mit Label "Klickzähler" und Startwert 0 angezeigt wird.
  test("rendert Counter mit Label 'Klickzähler' und Startwert 0", () => {
    // Rendert die Hauptkomponente, die intern den Counter mit initialValue = 0 verwendet.
    render(<ReactComponentsExample />);

    // Sucht den Absatztext, der mit "Klickzähler:" beginnt.
    // Der Text enthält anschließend den aktuellen Zählerstand.
    const counterText = screen.getByText(/klickzähler:/i);

    // Erwartet, dass der Text "Klickzähler: 0" enthält,
    // also dass der initiale Zählerstand 0 ist.
    expect(counterText).toHaveTextContent("Klickzähler: 0");

    // Sucht den Button mit der Beschriftung "+1",
    // der für das Erhöhen des Zählerstands zuständig ist.
    const incrementButton = screen.getByRole("button", { name: "+1" });
    // Sucht den Button mit der Beschriftung "-1",
    // der für das Verringern des Zählerstands zuständig ist.
    const decrementButton = screen.getByRole("button", { name: "-1" });

    // Erwartet, dass der +1 Button im Dokument vorhanden ist.
    expect(incrementButton).toBeInTheDocument();
    // Erwartet, dass der -1 Button im Dokument vorhanden ist.
    expect(decrementButton).toBeInTheDocument();
  });

  // Definiert einen Testfall, der die Erhöhung des Zählerwerts über den +1-Button prüft.
  test("erhöht den Zählerwert beim Klick auf '+1'", () => {
    // Rendert erneut die Hauptkomponente.
    render(<ReactComponentsExample />);

    // Sucht den Text, der den aktuellen Zählerstand enthält.
    const counterText = screen.getByText(/klickzähler:/i);
    // Sucht den Button, der die Erhöhung des Zählers auslöst.
    const incrementButton = screen.getByRole("button", { name: "+1" });

    // Erwartet, dass der anfängliche Wert im Text "Klickzähler: 0" ist.
    expect(counterText).toHaveTextContent("Klickzähler: 0");

    // Simuliert einen Klick auf den +1-Button,
    // was intern setCount(prev => prev + 1) auslöst.
    fireEvent.click(incrementButton);

    // Erwartet, dass nach einem Klick der Text "Klickzähler: 1" enthält,
    // also dass der Zählerstand um 1 erhöht wurde.
    expect(counterText).toHaveTextContent("Klickzähler: 1");

    // Simuliert einen zweiten Klick auf denselben Button,
    // um zu prüfen, ob der Zähler weiter korrekt erhöht wird.
    fireEvent.click(incrementButton);

    // Erwartet, dass der Zähler nach zwei Klicks den Wert 2 erreicht hat.
    expect(counterText).toHaveTextContent("Klickzähler: 2");
  });

  // Definiert einen Testfall, der die Verringerung des Zählerwerts über den -1-Button prüft.
  test("verringert den Zählerwert beim Klick auf '-1'", () => {
    // Rendert die Hauptkomponente.
    render(<ReactComponentsExample />);

    // Sucht den Text, der den aktuellen Zählerstand anzeigt.
    const counterText = screen.getByText(/klickzähler:/i);
    // Sucht den Button mit der Beschriftung "-1".
    const decrementButton = screen.getByRole("button", { name: "-1" });

    // Erwartet, dass der Startwert des Counters 0 ist.
    expect(counterText).toHaveTextContent("Klickzähler: 0");

    // Simuliert einen Klick auf den -1-Button,
    // was intern setCount(count - 1) auslöst.
    fireEvent.click(decrementButton);

    // Erwartet, dass der Zählerwert nun -1 beträgt
    // und entsprechend im Text dargestellt wird.
    expect(counterText).toHaveTextContent("Klickzähler: -1");
  });

  // Definiert einen Testfall, der das useEffect-Verhalten des Counters überprüft.
  // Konkret wird geprüft, ob console.log aufgerufen wird, wenn sich der Zählerstand ändert.
  test("ruft console.log beim Rendern und bei Änderungen des Counters auf", () => {
    // Erstellt einen Spy auf console.log, um Aufrufe beobachten zu können.
    // mockImplementation(() => {}) ersetzt die eigentliche Logik durch eine leere Funktion,
    // damit keine Ausgabe in der Testkonsole erscheint.
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    // Rendert die Hauptkomponente, wodurch der Counter mit initialValue 0 gerendert wird.
    // Beim ersten Render wird das useEffect mit count = 0 ausgeführt.
    render(<ReactComponentsExample />);

    // Erwartet, dass console.log mindestens einmal mit dem Text
    // "Neuer Count-Wert: 0" aufgerufen wurde, entsprechend dem initialen Wert.
    expect(logSpy).toHaveBeenCalledWith("Neuer Count-Wert: 0");

    // Löscht die bisher gesammelten Aufrufe im Spy,
    // um nur die Aufrufe zu berücksichtigen, die nach der folgenden Aktion passieren.
    logSpy.mockClear();

    // Sucht den +1-Button, um den Zählerwert zu erhöhen.
    const incrementButton = screen.getByRole("button", { name: "+1" });
    // Simuliert einen Klick auf den +1-Button, wodurch count auf 1 erhöht wird.
    fireEvent.click(incrementButton);

    // Erwartet, dass console.log nun mit "Neuer Count-Wert: 1" aufgerufen wurde,
    // weil sich der Zählerstand durch useState geändert hat und der Effekt erneut lief.
    expect(logSpy).toHaveBeenCalledWith("Neuer Count-Wert: 1");
  });
});
