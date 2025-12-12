// Import der wichtigsten Helfer von React Testing Library:
// - render: rendert eine React-Komponente in einer isolierten Testumgebung (JSDOM).
// - screen: bietet Zugriff auf das gerenderte DOM über semantische Queries.
import { render, screen } from "@testing-library/react";

// Import der Jest-DOM-Erweiterungen, damit zusätzliche Matcher wie
// toBeInTheDocument, toHaveTextContent usw. verfügbar sind.
import "@testing-library/jest-dom";

// Import der Komponente, die wir testen möchten.
// ReactStylingExample enthält alle drei Styling-Varianten (CSS-Modules, styled-components, Fluent UI).
import { ReactStylingExample } from "./ReactStylingExample";

/* ============================================================================
 * Test-Suite: ReactStylingExample
 * ----------------------------------------------------------------------------
 * Diese Tests prüfen die Struktur und Texte der Styling-Demo:
 * - Grundlayout und erklärende Texte
 * - Vorhandensein der Badges mit allen Status-Labels
 * - Fluent UI MessageBars mit den korrekten Meldungen und Dismiss-Buttons
 * ========================================================================= */

describe("ReactStylingExample (Styling-Demo)", () => {
  /* -------------------------------------------------------------------------
   * Test 1: Grundlayout & erklärender Text
   * ------------------------------------------------------------------------
   * Ziel:
   * - Sicherstellen, dass die Hauptüberschrift gerendert wird.
   * - Prüfen, dass der erklärende Absatz vorhanden ist.
   * - Prüfen, dass alle drei Sektionen korrekt betitelt sind:
   *   - CSS-Modules Badges
   *   - styled-components Badges
   * ---------------------------------------------------------------------- */
  test("rendert Grundlayout mit Titel, Beschreibung und allen Abschnittsüberschriften", () => {
    // Arrange/Act: Die Hauptkomponente rendern.
    render(<ReactStylingExample />);

    // Sucht nach der H1-Überschrift "React Styling Demo" über ihre Rolle "heading"
    // und das sichtbare Label (case-insensitive dank /i).
    const mainTitle = screen.getByRole("heading", {
      level: 1,
      name: /react styling demo/i,
    });

    // Sucht den erklärenden Absatz, der die verwendeten Techniken beschreibt.
    // Wir suchen nach einem charakteristischen Ausschnitt des Textes.
    const descriptionParagraph = screen.getByText(
      /css-modules, inline-styles,\s*styled-components und fluent ui komponenten/i
    );

    // Sucht die H2-Überschrift für die CSS-Modules-Sektion.
    const cssModulesHeading = screen.getByRole("heading", {
      level: 2,
      name: /css-modules badges/i,
    });

    // Sucht die H2-Überschrift für die styled-components-Sektion.
    const styledComponentsHeading = screen.getByRole("heading", {
      level: 2,
      name: /styled-components badges/i,
    });

    // Sucht die H2-Überschrift für die Fluent UI MessageBars-Sektion.
    const fluentUIHeading = screen.getByRole("heading", {
      level: 2,
      name: /fluent ui messagebars/i,
    });

    // Erwartung: Die Hauptüberschrift ist im Dokument vorhanden.
    expect(mainTitle).toBeInTheDocument();
    // Erwartung: Der erklärende Absatz ist sichtbar.
    expect(descriptionParagraph).toBeInTheDocument();
    // Erwartung: Überschrift für CSS-Modules-Badges ist vorhanden.
    expect(cssModulesHeading).toBeInTheDocument();
    // Erwartung: Überschrift für styled-components-Badges ist vorhanden.
    expect(styledComponentsHeading).toBeInTheDocument();
    // Erwartung: Überschrift für Fluent UI MessageBars ist vorhanden.
    expect(fluentUIHeading).toBeInTheDocument();

    // Zusätzlich prüfen wir noch den Hinweis-Text am Ende der Seite,
    // der erklärt, welche Bereiche wie gestylt werden.
    const hintText = screen.getByText(/die ersten badges werden über css-klassen/i);
    expect(hintText).toBeInTheDocument();
  });

  /* -------------------------------------------------------------------------
   * Test 2: Badges mit allen Status-Labels (CSS-Modules + styled-components)
   * ------------------------------------------------------------------------
   * Ziel:
   * - Sicherstellen, dass für jeden Status ("success", "warning", "error")
   *   ein Badge-Label in beiden Badge-Reihen vorhanden ist.
   * - Da sowohl die CSS-Modules-Variante als auch die styled-components-
   *   Variante die gleichen Label-Texte verwenden ("Erfolgreich", "Warnung",
   *   "Fehler"), erwarten wir jeweils zwei Vorkommen.
   * ---------------------------------------------------------------------- */
  test("zeigt für jeden Status die Badge-Labels sowohl bei CSS-Modules als auch bei styled-components", () => {
    // Komponente rendern.
    render(<ReactStylingExample />);

    // Sucht alle Elemente, deren Text exakt "Erfolgreich" ist.
    // Erwartung: einmal in der CSS-Modules-Reihe, einmal in der styled-components-Reihe.
    const successBadges = screen.getAllByText("Erfolgreich");
    // Sucht alle Elemente mit dem Text "Warnung".
    const warningBadges = screen.getAllByText("Warnung");
    // Sucht alle Elemente mit dem Text "Fehler".
    const errorBadges = screen.getAllByText("Fehler");

    // Erwartung: Zwei "Erfolgreich"-Badges (CSS-Modules + styled-components).
    expect(successBadges).toHaveLength(2);
    // Erwartung: Zwei "Warnung"-Badges (CSS-Modules + styled-components).
    expect(warningBadges).toHaveLength(2);
    // Erwartung: Zwei "Fehler"-Badges (CSS-Modules + styled-components).
    expect(errorBadges).toHaveLength(2);

    // Zusätzlich prüfen wir, dass diese Elemente tatsächlich im Dokument sind.
    // (Streng genommen wird das durch getAllByText schon implizit garantiert,
    // aber die folgenden Assertions machen die Absicht im Test noch klarer.)
    successBadges.forEach((badge) => {
      expect(badge).toBeInTheDocument();
    });
    warningBadges.forEach((badge) => {
      expect(badge).toBeInTheDocument();
    });
    errorBadges.forEach((badge) => {
      expect(badge).toBeInTheDocument();
    });
  });
});
