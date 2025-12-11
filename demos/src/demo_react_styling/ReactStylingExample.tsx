// Import des CSS-Modules (lokale, gekapselte CSS-Klassen)
import styles from "./ReactStylingExample.module.css";
// Import von styled-components für komponentenbasiertes Styling
import styled, { css } from "styled-components";
// Import von Fluent UI Komponenten
import {
  Stack,
  IStackTokens,
  MessageBar,
  MessageBarType,
  initializeIcons,
} from "@fluentui/react";

/* ---------------------------------------------------------------------------
 * Globales Setup für Fluent UI
 * ------------------------------------------------------------------------- */

// Registriert die Standard-Icons von Fluent UI.
// In einer realen App idealerweise einmal im App-Root ausführen.
initializeIcons();

/* ---------------------------------------------------------------------------
 * Gemeinsame Typen für Status-Darstellung
 * ------------------------------------------------------------------------- */

// Eingeschränkter Wertebereich für Status – verhindert Tippfehler und
// erleichtert Abgleich/Mapping in allen Varianten.
type Status = "success" | "warning" | "error";

// Props, die alle Status-Komponenten gemeinsam nutzen.
// So können wir dieselbe Signatur in allen drei Varianten verwenden.
interface StatusBadgeProps {
  status: Status; // steuert die Farb-/Typ-Variante
  label: string;  // Text, der angezeigt wird
}

/* ---------------------------------------------------------------------------
 * Variante 1: Badge mit CSS-Modules
 * ------------------------------------------------------------------------- */

function StatusBadge({ status, label }: StatusBadgeProps) {
  // Mapping von Status-Wert zu spezifischer CSS-Klasse im CSS-Module.
  // Dadurch bleibt die Logik im TypeScript und die Styles im CSS.
  const statusClassMap: Record<Status, string> = {
    success: styles.badgeSuccess,
    warning: styles.badgeWarning,
    error: styles.badgeError,
  };

  return (
    <span
      // Basisklasse + status-spezifische Klasse werden kombiniert,
      // z.B. "badge badgeSuccess".
      className={`${styles.badge} ${statusClassMap[status]}`}
    >
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Variante 2: Badge komplett mit styled-components
 * ------------------------------------------------------------------------- */

// Styled-Component, die Styling direkt an das React-Element bindet.
// Das generische Props-Objekt { status: Status } erlaubt bedingte Styles
// basierend auf dem Status-Wert.
const StyledBadge = styled.span<{ status: Status }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;

  /* Varianten-Styles abhängig vom Status-Prop.
     Das css-Helper-Tag ermöglicht saubere, wiederverwendbare Snippets. */
  ${({ status }) =>
    status === "success" &&
    css`
      background-color: #e0f7e9;
      color: #0f5132;
      border-color: #badbcc;
    `}

  ${({ status }) =>
    status === "warning" &&
    css`
      background-color: #fff3cd;
      color: #664d03;
      border-color: #ffecb5;
    `}

  ${({ status }) =>
    status === "error" &&
    css`
      background-color: #f8d7da;
      color: #842029;
      border-color: #f5c2c7;
    `}
`;

// Kleine Wrapper-Komponente, um dieselbe Props-Struktur wie bei StatusBadge
// wiederzuverwenden und den Aufruf im JSX konsistent zu halten.
function StyledStatusBadge({ status, label }: StatusBadgeProps) {
  return <StyledBadge status={status}>{label}</StyledBadge>;
}

/* ---------------------------------------------------------------------------
 * Variante 3: Status-Anzeige mit Fluent UI MessageBar
 * ------------------------------------------------------------------------- */

// Layout-Abstand zwischen Kindern innerhalb des Stack-Containers.
const fluentStackTokens: IStackTokens = { childrenGap: 8 };

// Nutzt MessageBar-Komponenten von Fluent UI, um Statusmeldungen
// im Microsoft-Design auszugeben.
function FluentStatusMessage({ status, label }: StatusBadgeProps) {
  // Mapping unserer Status-Werte auf die vordefinierten MessageBarType-Werte
  // von Fluent UI.
  const typeMap: Record<Status, MessageBarType> = {
    success: MessageBarType.success,
    warning: MessageBarType.warning,
    error: MessageBarType.error,
  };

  return (
    <MessageBar
      messageBarType={typeMap[status]}
      isMultiline={false}
      // Accessibility-Label für Screenreader am Close-Button
      dismissButtonAriaLabel="Meldung schließen"
    >
      {label}
    </MessageBar>
  );
}

/* ---------------------------------------------------------------------------
 * Hauptbeispiel-Komponente: zeigt alle drei Ansätze nebeneinander
 * ------------------------------------------------------------------------- */

export function ReactStylingExample() {
  return (
    <div
      // Grundlayout & Typografie über CSS-Module geregelt.
      className={styles.container}
      // Inline-Style als bewusstes Beispiel für schnelle, lokale Anpassungen.
      style={{
        marginTop: "1rem", // camelCase statt margin-top
      }}
    >
      <h1 className={styles.title}>React Styling Demo</h1>

      <p className={styles.text}>
        Dieses Beispiel zeigt, wie Sie CSS-Modules, Inline-Styles,
        styled-components und Fluent UI Komponenten in React kombinieren können.
      </p>

      {/* --------------------------------------------------------------------
          1. Reihe: Status-Badges mit CSS-Modules
          ------------------------------------------------------------------ */}
      <h2 className={styles.subtitle}>CSS-Modules Badges</h2>
      <div className={styles.badgeRow}>
        <StatusBadge status="success" label="Erfolgreich" />
        <StatusBadge status="warning" label="Warnung" />
        <StatusBadge status="error" label="Fehler" />
      </div>

      {/* --------------------------------------------------------------------
          2. Reihe: Status-Badges mit styled-components
          ------------------------------------------------------------------ */}
      <h2 className={styles.subtitle}>styled-components Badges</h2>
      <div className={styles.badgeRow}>
        <StyledStatusBadge status="success" label="Erfolgreich" />
        <StyledStatusBadge status="warning" label="Warnung" />
        <StyledStatusBadge status="error" label="Fehler" />
      </div>

      {/* --------------------------------------------------------------------
          3. Reihe: Status-Meldungen mit Fluent UI MessageBar
          ------------------------------------------------------------------ */}
      <h2 className={styles.subtitle}>Fluent UI MessageBars</h2>
      {/* Stack kümmert sich um vertikalen Abstand und Layout der MessageBars */}
      <Stack tokens={fluentStackTokens}>
        <FluentStatusMessage
          status="success"
          label="Die Aktion wurde erfolgreich ausgeführt."
        />
        <FluentStatusMessage
          status="warning"
          label="Bitte überprüfen Sie Ihre Eingaben."
        />
        <FluentStatusMessage
          status="error"
          label="Es ist ein Fehler aufgetreten."
        />
      </Stack>

      <p className={styles.hint}>
        Die ersten Badges werden über CSS-Klassen aus dem CSS-Module gestylt,
        die zweiten über <code>styled-components</code> und die unteren
        Meldungen verwenden fertige Komponenten aus <code>@fluentui/react</code>.
      </p>
    </div>
  );
}
