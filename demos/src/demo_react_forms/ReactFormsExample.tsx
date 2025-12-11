import { useState } from "react";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import styles from "./ReactFormsExample.module.css";

/* ---------------------------------------------------------------------------
 * Typen für Formularstruktur und Props
 * ------------------------------------------------------------------------- */

// Struktur der Formulardaten, die react-hook-form verwaltet.
// Diese Typisierung sorgt dafür, dass Feldnamen in register/Errors typsicher sind.
interface SimpleFormData {
  name: string;
  favoriteColor: string;
}

// Props für die Kind-Komponente SimpleForm.
// Der Parent wird bei erfolgreichem Submit mit den Daten informiert.
interface SimpleFormProps {
  onSubmitSuccess: (data: SimpleFormData) => void;
}

/* ---------------------------------------------------------------------------
 * Formular-Komponente mit react-hook-form
 * ------------------------------------------------------------------------- */

function SimpleForm({ onSubmitSuccess }: SimpleFormProps) {
  // Lokale Meldung, die Statusinformationen ausgibt:
  // - Button wurde geklickt
  // - Validierung fehlgeschlagen
  // - Submit erfolgreich
  const [message, setMessage] = useState<string>("");

  // useForm stellt zentrale Formular-APIs bereit:
  // - register: Verbindung zwischen Input-Feldern und dem Form-State
  // - handleSubmit: Wrapper, der Validierung ausführt und dann onValid/onInvalid aufruft
  // - formState.errors: enthält Validierungsfehler pro Feld
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimpleFormData>({
    // Startwerte für die Felder; optional, aber hier zur Vollständigkeit gesetzt.
    defaultValues: {
      name: "",
      favoriteColor: "",
    },
    // mode steuert, wann Validierung ausgelöst wird.
    // "onTouched" = sobald ein Feld einmal fokussiert und wieder verlassen wurde.
    mode: "onTouched",
  });

  // Wird aufgerufen, sobald der Senden-Button geklickt wird –
  // noch bevor die Validierung von react-hook-form durchläuft.
  const handleClickSubmitButton = () => {
    setMessage("Absenden wurde geklickt. Eingaben werden geprüft...");
  };

  // Handler für den Erfolgsfall: Validierung war erfolgreich,
  // Daten sind formal korrekt.
  const onValidSubmit: SubmitHandler<SimpleFormData> = (data) => {
    setMessage("Formular erfolgreich gesendet!");
    // Daten nach oben an die Parent-Komponente weiterreichen.
    onSubmitSuccess(data);
  };

  // Handler für den Fehlerfall: mindestens ein Feld ist laut Validierungsregeln ungültig.
  const onInvalidSubmit = () => { setMessage("Bitte korrigieren Sie die markierten Felder.");};


  // Hilfsfunktion für CSS-Fehlerzustand.
  // So muss die Logik zur Fehlererkennung nicht mehrfach in JSX wiederholt werden.
  // keyof SimpleFormData -> field darf nur ein Schlüsselname von SimpleFormData sein, also z.B. name und favoriteColor
  const hasError = (field: keyof SimpleFormData) => Boolean(errors[field]);

  return (
    <form
      className={styles.form}
      // handleSubmit übernimmt das Event-Handling von onSubmit,
      // führt Validierung aus und ruft je nach Ergebnis onValidSubmit / onInvalidSubmit auf.
      onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
    >
      <h1 className={styles.title}>Einfaches Formular</h1>

      {/* Name-Feld mit Validierung */}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <input
          id="name"
          type="text"
          // Fehlerhafte Felder erhalten eine zusätzliche CSS-Klasse für visuelles Feedback.
          className={`${styles.input} ${
            hasError("name") ? styles.inputError : ""
          }`}
          // register verbindet dieses Input-Feld mit dem Form-State unter dem Key "name"
          // und hinterlegt gleichzeitig die Validierungsregeln für dieses Feld.
          {...register("name", {
            required: "Name ist erforderlich.",
            minLength: {
              value: 2,
              message: "Name muss mindestens 2 Zeichen lang sein.",
            },
          })}
        />
        {/* Fehlernachricht für dieses Feld, falls vorhanden */}
        {errors.name && (
          <p className={styles.error}>{errors.name.message}</p>
        )}
      </div>

      {/* Lieblingsfarbe-Feld mit Validierung */}
      <div className={styles.field}>
        <label htmlFor="favoriteColor" className={styles.label}>
          Lieblingsfarbe
        </label>
        <input
          id="favoriteColor"
          type="text"
          className={`${styles.input} ${
            hasError("favoriteColor") ? styles.inputError : ""
          }`}
          {...register("favoriteColor", {
            required: "Lieblingsfarbe ist erforderlich.",
          })}
        />
        {errors.favoriteColor && (
          <p className={styles.error}>{errors.favoriteColor.message}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.button}
        // onClick-Meldung wird ausgegeben, bevor handleSubmit greift.
        // So hat der User direkt Feedback, dass etwas passiert.
        onClick={handleClickSubmitButton}
      >
        Senden
      </button>

      {/* Dynamische Statusmeldung:
          - nach Klick
          - nach Validierungsfehler
          - nach erfolgreichem Submit */}
      {message && <p className={styles.success}>{message}</p>}
    </form>
  );
}

/* ---------------------------------------------------------------------------
 * Parent-Komponente: hält die zuletzt gesendeten Daten
 * ------------------------------------------------------------------------- */

export function ReactFormsExample() {
  // Parent speichert die zuletzt erfolgreich übermittelten Formulardaten.
  // null bedeutet: noch nichts erfolgreich gesendet.
  const [lastSubmittedData, setLastSubmittedData] =
    useState<SimpleFormData | null>(null);

  // Callback wird an das Child übergeben und dort im Erfolgsfall aufgerufen.
  function handleSubmitSuccess(data: SimpleFormData) {
    setLastSubmittedData(data);
  }

  return (
    <div className={styles.container}>
      {/* SimpleForm erhält eine Callback-Prop, über die es erfolgreiche
          Submit-Daten nach oben melden kann. */}
      <SimpleForm onSubmitSuccess={handleSubmitSuccess} />

      {/* Anzeige der zuletzt gesendeten Daten, nur wenn bereits ein Submit
          erfolgreich war. */}
      {lastSubmittedData && (
        <p className={styles.info}>
          Zuletzt gesendet:{" "}
          <strong>
            {lastSubmittedData.name} (Lieblingsfarbe:{" "}
            {lastSubmittedData.favoriteColor})
          </strong>
        </p>
      )}
    </div>
  );
}
