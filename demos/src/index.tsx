// ---------------------------------------------------------
// Einstiegspunkt der React-Anwendung (Entry Point)
// ---------------------------------------------------------
//
// Diese Datei ist der zentrale Einstiegspunkt für die React-App.
// Hier wird:
//  - das Wurzelelement im DOM ermittelt,
//  - das React-Root erstellt,
//  - die App-Komponente in dieses Root gerendert,
//  - optional das Performance-Monitoring (Web Vitals) initialisiert.

import React from 'react';
// React:
// - stellt die Kernfunktionen für das Bauen von Komponenten bereit
// - wird hier benötigt, um JSX (<App /> usw.) zu interpretieren.

import ReactDOM from 'react-dom/client';
// ReactDOM:
// - zuständig für das Rendern von React-Komponenten in den echten DOM-Baum im Browser.
// - 'react-dom/client' (ab React 18) liefert die createRoot-API für das neue Root-Rendering.

import './index.css';
// Globale CSS-Datei:
// - Enthält typischerweise Basis-Styles (Body-Margins, Standard-Fonts etc.).
// - Wird einmalig hier eingebunden, sodass die Styles global in der App zur Verfügung stehen.

import App from './App';
// App-Komponente:
// - Die Haupt-Root-Komponente der React-Anwendung.
// - In App.tsx/App.jsx ist üblicherweise die komplette App-Struktur hinterlegt (Router, Layout, etc.).

import reportWebVitals from './reportWebVitals';
// reportWebVitals:
// - Funktion, die Kennzahlen zur Performance der Anwendung (sog. "Web Vitals") erhebt.
// - Kann genutzt werden, um z. B. LCP, FID, CLS etc. zu messen.
// - Die Messwerte können geloggt oder an ein Monitoring-/Analytics-System gesendet werden.

// ---------------------------------------------------------
// Ermitteln des Wurzel-DOM-Elements und Erzeugen des React-Roots
// ---------------------------------------------------------
//
// document.getElementById('root'):
// - Sucht im HTML-Dokument nach dem Element mit id="root".
// - Typischerweise im public/index.html definiert als:
//     <div id="root"></div>
//
// as HTMLElement:
// - TypeScript Type Assertion: wir sagen dem Compiler, dass das gefundene Element
//   ein HTMLElement ist (nicht z. B. null oder ein generisches Element).
//   -> Hier wird davon ausgegangen, dass "root" im DOM sicher existiert.
//
// ReactDOM.createRoot(...):
// - Neue API seit React 18 für Concurrent Rendering.
// - Erstellt ein sogenanntes "Root" für eine React-Anwendung.
// - Über dieses Root können wir später root.render(...) aufrufen.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// ---------------------------------------------------------
// Rendern der React-Anwendung
// ---------------------------------------------------------
//
// root.render(...):
// - Startet das Rendern der React-Komponenten-Hierarchie in das zuvor
//   erstellte Root-DOM-Element.
// - Alles, was in JSX innerhalb von root.render(...) steht, wird in den
//   <div id="root"></div>-Container im HTML gemountet.
root.render(
  // React.StrictMode:
  // - Hilfskomponente, die nur in der Entwicklungsumgebung aktiv ist.
  // - Führt zusätzliche Checks aus, z. B.:
  //     - Warnungen bei unsicheren Lifecycle-Methoden
  //     - Doppeltes Ausführen bestimmter Funktionen (im Dev-Mode),
  //       um Seiteneffekte sichtbar zu machen.
  // - Hat keinen Einfluss auf das Verhalten in der Produktion (wird dort entfernt).
  <React.StrictMode>
    {/* App ist die Wurzelkomponente der Anwendung */}
    <App />
  </React.StrictMode>
);

// ---------------------------------------------------------
// Web Vitals / Performance-Messung
// ---------------------------------------------------------
//
// reportWebVitals():
// - Standard-Setup aus create-react-app (CRA).
// - Wenn man Performance messen möchte, kann man dieser Funktion einen Callback
//   übergeben, der die Werte verarbeitet (z. B. console.log oder eine Funktion,
//   die die Daten an ein Analytics-System sendet).
//
// Beispiel:
//   reportWebVitals(console.log);
//   -> gibt die Messwerte in der Browser-Konsole aus.
//
// Standard-Kommentar (englisch aus CRA-Template):
//   // If you want to start measuring performance in your app, pass a function
//   // to log results (for example: reportWebVitals(console.log))
//   // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//
// In dieser Variante wird reportWebVitals ohne Parameter aufgerufen.
// Das bedeutet: Es wird zwar initialisiert, aber es wird kein Logging oder
// Senden an ein externes System vorgenommen, solange kein Callback übergeben wird.
reportWebVitals();
