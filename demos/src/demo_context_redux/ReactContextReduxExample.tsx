import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { Provider, useDispatch, useSelector } from "react-redux";

import styles from "./ReactContextReduxExample.module.css";

/* ---------------------------------------------------------------------------
 * CONTEXT-BEISPIEL: THEME (light / dark)
 * ------------------------------------------------------------------------- */

/**
 * `Theme` beschreibt die erlaubten Werte für das Theme.
 *
 * Warum nicht einfach `string`?
 * - Mit `"light" | "dark"` verhindert TypeScript Tippfehler wie "ligth".
 * - Außerdem wird klar: Es gibt genau zwei gültige Optionen.
 */
type Theme = "light" | "dark";

/**
 * Das ist die Form der Daten, die wir über Context teilen möchten.
 *
 * Wir geben zwei Dinge an alle untergeordneten Komponenten weiter:
 * - `theme`: den aktuellen Theme-Wert
 * - `toggleTheme`: eine Funktion, um das Theme umzuschalten
 *
 * Diese Kombination ist typisch:
 * - Zustand + Funktion zum Ändern dieses Zustands.
 */
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Hier erstellen wir den Context.
 *
 * createContext braucht einen Startwert.
 * Wir nutzen bewusst `undefined`, um später erkennen zu können,
 * ob jemand den Context verwendet, ohne dass ein Provider vorhanden ist.
 *
 * Das ist eine Sicherheitsmaßnahme:
 * - Ohne Provider gäbe es sonst unerwartete `null`-Fehler
 *   oder still falsche Werte.
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Custom Hook: `useTheme`
 *
 * Warum überhaupt ein Custom Hook?
 * - Damit der restliche Code nicht überall `useContext(ThemeContext)` schreiben muss.
 * - Damit man den Zugriffs- und Sicherheitscheck an einer zentralen Stelle hat.
 *
 * Ergebnis:
 * - Jede Komponente, die `useTheme()` nutzt, erhält garantiert einen gültigen Wert,
 *   solange sie unterhalb des ThemeProviders gerendert wird.
 */
function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);

  /**
   * Falls `ctx` undefined ist, bedeutet das:
   * - Es gibt keinen ThemeProvider oberhalb dieser Komponente.
   * - Der Entwickler hat den Provider vergessen oder die Komponente
   *   wurde außerhalb des erwarteten Baums verwendet.
   *
   * Wir werfen einen klaren Fehler, damit das Problem sofort sichtbar wird.
   */
  if (!ctx) {
    throw new Error("useTheme muss innerhalb von ThemeProvider verwendet werden.");
  }

  return ctx;
}

/**
 * ThemeProvider
 *
 * Das ist die Komponente, die:
 * - den Theme-Zustand besitzt
 * - die Umschaltlogik definiert
 * - diese Werte über den Context an alle Kinder weitergibt
 *
 * `children` ist ein React-Begriff:
 * - Alles, was zwischen <ThemeProvider> ... </ThemeProvider> steht.
 */
function ThemeProvider({ children }: { children: ReactNode }) {
  /**
   * Lokaler State für das Theme.
   *
   * Startwert: "light"
   * - Das ist die bei App-Start verwendete Standard-Optik.
   *
   * Hinweis:
   * - In einer echten App könnte man hier z.B. zuerst `localStorage` lesen,
   *   um das letzte gewählte Theme wiederherzustellen.
   */
  const [theme, setTheme] = useState<Theme>("light");

  /**
   * toggleTheme
   *
   * Wechselt das Theme zwischen "light" und "dark".
   * Wir nutzen die Callback-Form von setTheme,
   * damit wir sicher den aktuellsten Wert verwenden.
   */
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  /**
   * `value` ist das Objekt, das im Context bereitgestellt wird.
   *
   * Alle Kinder-Komponenten unterhalb dieses Providers können
   * dieses Objekt lesen (via useTheme()).
   */
  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return (
    /**
     * ThemeContext.Provider macht `value` für den gesamten Unterbaum verfügbar.
     */
    <ThemeContext.Provider value={value}>
      {/**
       * Neben dem "logischen" Context nutzen wir das Theme auch "optisch":
       *
       * Wir setzen auf ein Wrapper-DIV eine CSS-Klasse.
       * - themeLight oder themeDark verändert z.B. Farben, Hintergrund, Schrift etc.
       *
       * Ergebnis:
       * - Alle Inhalte darunter können automatisch im passenden Theme erscheinen.
       */}
      <div className={theme === "light" ? styles.themeLight : styles.themeDark}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/* ---------------------------------------------------------------------------
 * REDUX-BEISPIEL (mit Redux Toolkit): GLOBALER COUNTER
 * ------------------------------------------------------------------------- */

/**
 * In Redux definieren wir den Zustand typischerweise sehr strukturiert.
 *
 * `CounterState` beschreibt hier:
 * - Unser Counter hat genau eine Zahl namens `value`.
 *
 * Vorteil:
 * - Wenn wir später erweitern wollen (z.B. `step`, `lastUpdated`),
 *   passt dieses Muster gut.
 */
interface CounterState {
  value: number;
}

/**
 * Anfangszustand (Initial State).
 * Hier startet der Counter bei 0.
 */
const initialCounterState: CounterState = {
  value: 0,
};

/**
 * createSlice
 *
 * Das ist ein Redux Toolkit Helfer, der uns sehr viel Boilerplate spart.
 *
 * Ein "Slice" enthält:
 * - einen Namen
 * - einen Anfangszustand
 * - mehrere Reducer-Funktionen
 *
 * Reducer-Funktionen beschreiben:
 * - Wie sich der Zustand verändert, wenn eine bestimmte Action ausgelöst wird.
 */
const counterSlice = createSlice({
  name: "counter",
  initialState: initialCounterState,
  reducers: {
    /**
     * increment
     *
     * Erhöht den Counter um 1.
     *
     * Hinweis zu Redux Toolkit:
     * - Obwohl wir hier so tun, als würden wir "mutieren",
     *   erzeugt Redux Toolkit intern einen neuen, immutablen State.
     * - Das macht den Code einfacher zu lesen.
     */
    increment(state) {
      state.value += 1;
    },

    /**
     * decrement
     *
     * Verringert den Counter um 1.
     */
    decrement(state) {
      state.value -= 1;
    },

    /**
     * incrementBy
     *
     * Erhöht den Counter um eine Zahl, die beim Dispatch mitgegeben wird.
     *
     * `PayloadAction<number>` bedeutet:
     * - Die Action trägt eine Zahl als "Payload".
     * - Beispiel: incrementBy(5) → erhöht um 5.
     */
    incrementBy(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

/**
 * configureStore
 *
 * Baut den globalen Redux-Store.
 *
 * Der Store ist:
 * - der zentrale Ort, an dem Redux-Zustand liegt.
 *
 * In größeren Apps würde man hier mehrere Slices kombinieren.
 * In diesem Beispiel haben wir nur einen.
 */
const store = configureStore({
  reducer: counterSlice.reducer,
});

/**
 * RootState
 *
 * TypeScript-Helfer, der die Struktur des Store-Zustands beschreibt.
 *
 * Dadurch wissen `useSelector`-Aufrufe genau,
 * welche Felder existieren.
 */
type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch
 *
 * TypeScript-Helfer für den Dispatch-Typ.
 *
 * Vorteil:
 * - Beim Dispatchen von Actions bekommen wir Typ-Sicherheit.
 * - Besonders wichtig, wenn Actions Payloads haben.
 */
type AppDispatch = typeof store.dispatch;

/**
 * ReduxCounter
 *
 * Diese Komponente zeigt:
 * - wie man Redux-Zustand liest
 * - wie man Redux-Actions auslöst
 */
function ReduxCounter() {
  /**
   * useSelector
   *
   * Liesst Daten aus dem Redux-Store.
   *
   * Hier holen wir:
   * - den aktuellen count-Wert aus `state.value`.
   *
   * Warum `state.value`?
   * - Weil unser reducer direkt der counterSlice.reducer ist
   *   und dessen State-Form nur `{ value: number }` lautet.
   */
  const count = useSelector<RootState, number>((state: RootState) => state.value);

  /**
   * useDispatch
   *
   * Liefert eine Funktion, mit der wir Actions auslösen können.
   * Diese Actions verändern dann den globalen Redux-State.
   */
  const dispatch = useDispatch<AppDispatch>();

  return (
    <section className={styles.counterCard}>
      <h2 className={styles.sectionTitle}>Redux Counter</h2>
      <p className={styles.counterValue}>Wert: {count}</p>

      <div className={styles.counterButtons}>
        {/**
         * Buttons, die Actions dispatchen:
         *
         * - decrement() → -1
         * - increment() → +1
         * - incrementBy(5) → +5
         *
         * Die Action-Funktionen kommen automatisch aus dem Slice:
         * counterSlice.actions.*
         */}
        <button
          type="button"
          onClick={() => dispatch(counterSlice.actions.decrement())}
        >
          -1
        </button>
        <button
          type="button"
          onClick={() => dispatch(counterSlice.actions.increment())}
        >
          +1
        </button>
        <button
          type="button"
          onClick={() =>
            dispatch(counterSlice.actions.incrementBy(5))
          }
        >
          +5
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * LAYOUT-KOMPONENTE: NUTZT Context + Redux
 * ------------------------------------------------------------------------- */

function ContextReduxDemoLayout() {
  // useTheme liefert sowohl den aktuellen Theme-Wert als auch die
  // Umschaltfunktion aus dem Context.
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>React Context &amp; Redux Demo</h1>
        <p className={styles.subtitle}>
          Context für Transport (Theme), Redux Toolkit für globales State Management.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Theme (Context)</h2>
        <p className={styles.themeInfo}>
          Aktuelles Theme:{" "}
          <span className={styles.themeLabel}>{theme}</span>
        </p>
        {/* Button triggert die im Provider definierte Theme-Umschaltlogik. */}
        <button
          type="button"
          className={styles.themeButton}
          onClick={toggleTheme}
        >
          Theme wechseln
        </button>
      </section>

      {/* ReduxCounter demonstriert parallel zum Context ein globales
          State-Management mit Redux Toolkit. */}
      <ReduxCounter />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * HAUPT-BEISPIEL-KOMPONENTE FÜR App.tsx
 * ------------------------------------------------------------------------- */

export function ReactContextReduxExample() {
  // Provider-Hierarchie:
  // 1. Redux-Provider stellt den globalen Store für alle untergeordneten
  //    Komponenten bereit.
  // 2. ThemeProvider kümmert sich um das UI-Theme innerhalb der Demo.
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ContextReduxDemoLayout />
      </ThemeProvider>
    </Provider>
  );
}
