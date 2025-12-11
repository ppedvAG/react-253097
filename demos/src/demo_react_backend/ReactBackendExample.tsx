import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import styles from "./ReactBackendExample.module.css";

/* ---------------------------------------------------------------------------
 * Gemeinsame Typen & Konstanten
 * ------------------------------------------------------------------------- */

// Vereinfachter Datentyp für die NASA APOD API.
// Nur die Felder, die im UI tatsächlich genutzt werden, sind modelliert.
interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  date: string;
}

// Props für die Präsentationskomponente; sie erwartet ein bereits
// geladenes APOD-Objekt und kümmert sich nur um die Darstellung.
interface NasaApodCardProps {
  apod: NasaApod;
}

// API Key wird zur Build-Zeit aus der .env-Datei gelesen.
// In CRA müssen Variablen mit REACT_APP_ beginnen, damit sie im Frontend verfügbar sind.
const apiKey = process.env.REACT_APP_API_KEY;

// Gemeinsame Basis-URL, damit alle Varianten (fetch, axios, React Query)
// exakt dieselbe Ressource ansprechen.
const nasaApodUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

// React Query benötigt einen QueryClient, über den Caching, Refetching etc.
// konfiguriert werden. Er sollte pro App nur einmal erzeugt werden.
const queryClient = new QueryClient();

/* ---------------------------------------------------------------------------
 * Präsentationskomponente: APOD Karte
 * ------------------------------------------------------------------------- */

function NasaApodCard({ apod }: NasaApodCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{apod.title}</h2>
      <p className={styles.date}>{apod.date}</p>

      {/* APOD kann Bild oder Video sein; in dieser Demo wird von einem Bild ausgegangen. */}
      <img src={apod.url} alt={apod.title} className={styles.image} />

      <p className={styles.text}>{apod.explanation}</p>
    </article>
  );
}

/* ---------------------------------------------------------------------------
 * 2. Beispiel: Eigener Hook auf Basis von axios (useAxiosFetch)
 * ------------------------------------------------------------------------- */

// Generischer Fetch-Hook, der mit beliebigen Datentypen (T) arbeiten kann.
// Hier wird er mit NasaApod verwendet, könnte aber auch für andere Endpunkte
// wiederverwendet werden.
function useAxiosFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback stellt sicher, dass fetchData nur neu erzeugt wird,
  // wenn sich die URL ändert. Dadurch kann der useEffect darunter
  // sauber auf fetchData als Dependency hören.
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // axios kümmert sich hier um das Parsen der JSON-Response (response.data).
      const response = await axios.get<T>(url);
      setData(response.data);
    } catch (err) {
      // Fehler in eine lesbare Nachricht übersetzen; für nicht-Error-Objekte
      // gibt es einen generischen Fallback.
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      setError(message);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    // Initialer Load beim Mount der Komponente, die den Hook verwendet.
    fetchData();
  }, [fetchData]);

  // refetch gibt Konsumenten des Hooks die Möglichkeit, den Request
  // manuell erneut auszulösen (z.B. über einen Button).
  return { data, isLoading, error, refetch: fetchData };
}

/* ---------------------------------------------------------------------------
 * 3. Beispiel: React Query + axios
 * ------------------------------------------------------------------------- */

// Diese Komponente kapselt die React-Query-spezifische Logik.
// Sie erwartet lediglich eine URL; Query-Key + QueryFn werden hier definiert.
function ApodReactQueryExample({ url }: { url: string }) {
  const {
    data,
    isLoading,  // true beim initialen Laden
    isError,
    error,
    refetch,    // manuelles Refetch (z.B. über Button)
    isFetching, // true, solange ein laufender Request aktiv ist (auch bei Refetch)
  } = useQuery<NasaApod, Error>({
    // queryKey identifiziert diese Anfrage eindeutig im Cache.
    // Die URL ist Teil des Keys, damit unterschiedliche URLs separat gecacht werden.
    queryKey: ["apod", url],
    // queryFn beschreibt, wie die Daten tatsächlich geladen werden.
    queryFn: async () => {
      const response = await axios.get<NasaApod>(url);
      return response.data;
    },
  });

  return (
    <div>
      <button
        type="button"
        className={styles.button}
        onClick={() => refetch()}
        disabled={isFetching}
      >
        {isFetching ? "Lade..." : "Neu laden (React Query)"}
      </button>

      {isLoading && (
        <p className={styles.loading}>Daten werden geladen (React Query)...</p>
      )}

      {isError && (
        <p className={styles.error}>
          {/* error ist hier bereits vom Typ Error (durch useQuery-Generics),
             wird aber defensiv behandelt. */}
          Fehler (React Query): {error?.message ?? "Unbekannter Fehler"}
        </p>
      )}

      {/* Erfolgsfall: Daten vorhanden, kein Loading und kein Error */}
      {!isLoading && !isError && data && <NasaApodCard apod={data} />}

      {/* Fallback, falls trotz erfolgreichem Request keine Daten vorliegen */}
      {!isLoading && !isError && !data && (
        <p className={styles.info}>
          Noch keine Daten (React Query). Prüfe deinen API-Key oder versuche es
          erneut.
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Hauptbeispiel-Komponente: zeigt alle drei Varianten nebeneinander
 * ------------------------------------------------------------------------- */

export function ReactBackendExample() {
  /* -------------------------------------------------------------------------
   * 1. Beispiel: Direktes fetch + useEffect + useState
   * ----------------------------------------------------------------------- */
  const [apodFetch, setApodFetch] = useState<NasaApod | null>(null);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [errorFetch, setErrorFetch] = useState<string | null>(null);

  // Klassischer Ansatz mit fetch: explizite Behandlung von HTTP-Fehlern,
  // manuelles Parsen von JSON und Verwaltung der Lade-/Fehlerzustände.
  async function loadWithFetch() {
    setIsLoadingFetch(true);
    setErrorFetch(null);

    try {
      const response = await fetch(nasaApodUrl);

      // fetch wirft bei HTTP-Fehlern keinen Fehler von sich aus,
      // daher explizite Prüfung auf response.ok.
      if (!response.ok) {
        throw new Error(`HTTP-Fehler: ${response.status}`);
      }

      const data = (await response.json()) as NasaApod;
      setApodFetch(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unbekannter Fehler";
      setErrorFetch(`Fehler beim Laden (fetch): ${message}`);
      setApodFetch(null);
    } finally {
      setIsLoadingFetch(false);
    }
  }

  // Beim ersten Rendern einmalig laden (ähnlich componentDidMount).
  useEffect(() => {
    loadWithFetch();
  }, []);

  /* -------------------------------------------------------------------------
   * 2. Beispiel: useAxiosFetch-Hook
   * ----------------------------------------------------------------------- */

  // Der generische Hook wird hier konkret mit NasaApod verwendet.
  // Die Rückgabe wird mittels Destructuring in sprechende Variablenamen gemappt.
  const {
    data: apodAxios,
    isLoading: isLoadingAxios,
    error: errorAxios,
    refetch: refetchAxios,
  } = useAxiosFetch<NasaApod>(nasaApodUrl);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>React Backend Demo</h1>

      <p className={styles.description}>
        Dieses Beispiel zeigt drei unterschiedliche Varianten, um Daten von der
        NASA APOD REST-API zu laden:
        <br />
        <strong>1.</strong> Direktes <code>fetch</code>,{" "}
        <strong>2.</strong> eigener Hook mit <code>axios</code>,{" "}
        <strong>3.</strong> <code>React Query</code> mit <code>axios</code>.
      </p>

      <hr />

      {/* --------------------------------------------------------------------
          1. Variante: fetch direkt in der Komponente
          ------------------------------------------------------------------ */}
      <section>
        <h2>1. Variante: fetch + useEffect + useState</h2>

        <button
          type="button"
          className={styles.button}
          onClick={loadWithFetch}
          disabled={isLoadingFetch}
        >
          {isLoadingFetch ? "Lade..." : "Neu laden (fetch)"}
        </button>

        {isLoadingFetch && (
          <p className={styles.loading}>Daten werden geladen (fetch)...</p>
        )}

        {errorFetch && <p className={styles.error}>{errorFetch}</p>}

        {!isLoadingFetch && !errorFetch && apodFetch && (
          <NasaApodCard apod={apodFetch} />
        )}

        {!isLoadingFetch && !errorFetch && !apodFetch && (
          <p className={styles.info}>
            Noch keine Daten (fetch). Prüfe deinen API-Key oder versuche es
            erneut.
          </p>
        )}
      </section>

      <hr />

      {/* --------------------------------------------------------------------
          2. Variante: eigener Hook mit axios
          ------------------------------------------------------------------ */}
      <section>
        <h2>2. Variante: Eigener Hook (useAxiosFetch) + axios</h2>

        <button
          type="button"
          className={styles.button}
          onClick={refetchAxios}
          disabled={isLoadingAxios}
        >
          {isLoadingAxios ? "Lade..." : "Neu laden (axios + Hook)"}
        </button>

        {isLoadingAxios && (
          <p className={styles.loading}>
            Daten werden geladen (axios + Hook)...
          </p>
        )}

        {errorAxios && (
          <p className={styles.error}>
            Fehler (axios + Hook): {errorAxios}
          </p>
        )}

        {!isLoadingAxios && !errorAxios && apodAxios && (
          <NasaApodCard apod={apodAxios} />
        )}

        {!isLoadingAxios && !errorAxios && !apodAxios && (
          <p className={styles.info}>
            Noch keine Daten (axios + Hook). Prüfe deinen API-Key oder versuche
            es erneut.
          </p>
        )}
      </section>

      <hr />

      {/* --------------------------------------------------------------------
          3. Variante: React Query + axios
          ------------------------------------------------------------------ */}
      <section>
        <h2>3. Variante: React Query + axios</h2>

        {/* QueryClientProvider stellt den React-Query-Client für diese Sektion bereit.
           In einer echten App würde er typischerweise weiter oben (z.B. in App.tsx) sitzen. */}
        <QueryClientProvider client={queryClient}>
          <ApodReactQueryExample url={nasaApodUrl} />
        </QueryClientProvider>
      </section>
    </div>
  );
}
