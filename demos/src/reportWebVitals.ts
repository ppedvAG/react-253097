// ---------------------------------------------------------
// reportWebVitals – Web-Vitals-Messung in einer React-App
// ---------------------------------------------------------
//
// Zweck dieser Datei:
// - Stellt eine Hilfsfunktion reportWebVitals bereit, mit der
//   sogenannte "Web Vitals" (wichtige Performance-Kennzahlen
//   im Browser) gemessen und weiterverarbeitet werden können.
//
// Typische Verwendung (z. B. in index.tsx):
//   import reportWebVitals from './reportWebVitals';
//   reportWebVitals(console.log);
//   oder: reportWebVitals((metric) => sendToAnalytics(metric));
//
// Die Messgrößen (Web Vitals) sind u. a.:
// - CLS  (Cumulative Layout Shift)
// - FID  (First Input Delay)
// - FCP  (First Contentful Paint)
// - LCP  (Largest Contentful Paint)
// - TTFB (Time To First Byte)
//
// Diese Datei stammt im Kern aus dem create-react-app-Template
// und ist leicht angepasst/typisiert.

// ReportHandler:
// - Typ aus dem "web-vitals"-Paket.
// - Beschreibt die Signatur der Callback-Funktion, die für jede
//   gemessene Kennzahl aufgerufen wird.
// - Der Handler erhält ein "metric"-Objekt (z. B. mit name, value,
//   id, delta usw.), das dann beliebig weiterverarbeitet werden kann
//   (Logging, Monitoring, Analytics).
import { ReportHandler } from 'web-vitals';

// ---------------------------------------------------------
// reportWebVitals-Funktion
// ---------------------------------------------------------
//
// Parameter:
// - onPerfEntry (optional): Funktion, die bei jeder gemessenen
//   Kennzahl (CLS, FID, FCP, LCP, TTFB) aufgerufen wird.
//   Typ: ReportHandler (z. B. (metric) => { console.log(metric); })
//
// Verhalten:
// - Wenn ein gültiger Callback übergeben wird, lädt die Funktion
//   das "web-vitals"-Modul dynamisch (lazy loading).
// - Anschließend werden die verschiedenen Messfunktionen aufgerufen,
//   die jeweils den Callback mit einem Mess-Objekt versorgen.
//
// Nutzen von lazy import:
// - Das Modul "web-vitals" wird nur geladen, wenn tatsächlich
//   Performance-Messung gewünscht ist.
// - Verkleinert das initiale Bundle und verbessert die Ladezeit,
//   wenn Web-Vitals im Projekt nicht genutzt werden.
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  // Prüfen, ob ein Callback übergeben wurde UND ob es sich
  // tatsächlich um eine Funktion handelt.
  //
  // - onPerfEntry:
  //    - undefined/null: es wurde kein Handler übergeben -> keine Messung.
  //    - Funktion: soll für jede Metrik aufgerufen werden.
  //
  // - onPerfEntry instanceof Function:
  //    - Safety-Check, um sicherzustellen, dass onPerfEntry ausführbar ist.
  if (onPerfEntry && onPerfEntry instanceof Function) {

    // Dynamischer Import des "web-vitals"-Pakets:
    // - import('web-vitals') gibt ein Promise zurück, das das Modul lädt.
    // - Vorteil: Code-Splitting / lazy loading.
    //   Das Modul wird erst dann geladen, wenn tatsächlich ein Handler
    //   für Performance-Messung existiert.
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Die importierte Modul-Instanz wird per Destrukturierung in die
      // einzelnen Funktionen aufgespalten:
      // - getCLS:   misst den Cumulative Layout Shift
      // - getFID:   misst den First Input Delay
      // - getFCP:   misst den First Contentful Paint
      // - getLCP:   misst den Largest Contentful Paint
      // - getTTFB:  misst die Time To First Byte

      // Jede dieser Funktionen erwartet einen Callback vom Typ ReportHandler,
      // der mit den Messdaten aufgerufen wird, sobald die entsprechende
      // Metrik verfügbar ist.

      // CLS (Cumulative Layout Shift):
      // - Misst unerwartete Layout-Verschiebungen.
      // - Wichtig für wahrgenommene Stabilität des Layouts.
      getCLS(onPerfEntry);

      // FID (First Input Delay):
      // - Zeitspanne vom ersten Benutzer-Input (Klick, Taste etc.) bis zur
      //   Verarbeitung durch den Browser.
      // - Relevant für Interaktivität.
      getFID(onPerfEntry);

      // FCP (First Contentful Paint):
      // - Zeitpunkt, zu dem der erste "sinnvolle" Inhalt (Text/Bild) gerendert wird.
      // - Metrik für wahrgenommene Ladezeit des Inhalts.
      getFCP(onPerfEntry);

      // LCP (Largest Contentful Paint):
      // - Zeitpunkt, an dem das größte sichtbare Inhaltselement gerendert wird.
      // - Sehr wichtige Metrik für die wahrgenommene Lade-Geschwindigkeit.
      getLCP(onPerfEntry);

      // TTFB (Time To First Byte):
      // - Zeit vom Request des Dokuments bis zum Empfang des ersten Bytes
      //   der Antwort vom Server.
      // - Gibt Hinweise auf Server-Performance und Netzwerklatenz.
      getTTFB(onPerfEntry);
    });
  }
};

// Default-Export:
// - Erlaubt den Import ohne geschweifte Klammern:
//   import reportWebVitals from './reportWebVitals';
export default reportWebVitals;
