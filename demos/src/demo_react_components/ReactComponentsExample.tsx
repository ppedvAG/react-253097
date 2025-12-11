import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
 * Counter-Komponente: Lokaler, isolierter State + Lifecycle-Logik
 * ------------------------------------------------------------------------- */

// Props definieren, was von außen an die Counter-Komponente übergeben werden muss.
// Dadurch bleibt die Komponente flexibel und wiederverwendbar.
interface CounterProps {
  initialValue: number; // Startwert des Zählers (z.B. 0 oder ein anderer Anfangswert)
  label: string;        // Text, der vor dem Zählerwert angezeigt wird (Beschreibung)
}

// Funktionale Komponente "Counter" mit typisierten Props.
// Kapselt ihre eigene State- und Effekt-Logik, unabhängig von der Elternkomponente.
function Counter({ initialValue, label }: CounterProps) {
  // Lokaler State für den Zähler; der Startwert kommt einmalig aus den Props.
  // Änderungen an initialValue ändern den State danach nicht automatisch.
  const [count, setCount] = useState<number>(initialValue);

  // useEffect simuliert hier reaktive "Lifecycle"-Logik:
  // Der Effekt wird jedes Mal ausgeführt, wenn sich "count" ändert.
  // Das Dependency-Array [count] sorgt dafür, dass nicht bei jedem Render geloggt wird,
  // sondern nur dann, wenn der Zählerwert tatsächlich neu ist.
  useEffect(() => {
    console.log(`Neuer Count-Wert: ${count}`);
  }, [count]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "0.5rem",
        marginTop: "0.5rem",
      }}
    >
      <p>
        {label}: {count}
      </p>

      {/* setCount mit Callback-Form, um auf Basis des vorherigen Zustands zu aktualisieren.
          Das ist robuster, falls mehrere State-Updates in kurzer Folge anstehen. */}
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * UserList-Komponente: Darstellung einer Liste basierend auf Props
 * ------------------------------------------------------------------------- */

// Datentyp für einen User-Eintrag in der Liste.
// Diese Struktur wird sowohl im State als auch in Props wiederverwendet.
interface User {
  id: number;
  name: string;
  role: string;
}

// Props für die UserList-Komponente.
// Die Liste selbst wird von außen geliefert, die Komponente rendert nur.
interface UserListProps {
  title: string; // Überschrift für die gesamte Liste
  users: User[]; // Liste von User-Objekten, die dargestellt werden sollen
}

// "UserList" ist eine rein präsentationsorientierte Komponente,
// die keine eigene Logik/State hat, sondern nur die Props abbildet.
function UserList({ title, users }: UserListProps) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {users.map((user) => (
          // key hilft React, Listenelemente stabil zuzuordnen
          // und unnötige DOM-Updates zu vermeiden.
          <li key={user.id}>
            {user.name} ({user.role})
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Hauptbeispiel-Komponente: orchestriert UserList und Counter
 * ------------------------------------------------------------------------- */

// Diese Komponente ist der Einstiegspunkt, den Sie in App.tsx verwenden.
// Sie hält die Daten (users) und reicht sie an Kindkomponenten weiter.
export function ReactComponentsExample() {
  // State in der Elternkomponente für eine User-Liste.
  // Hier wird der Setter nicht genutzt, aber useState bietet die Option,
  // später dynamisch User hinzuzufügen/zu ändern.
  const [users] = useState<User[]>([
    { id: 1, name: "Alice", role: "Developer" },
    { id: 2, name: "Bob", role: "Designer" },
    { id: 3, name: "Charlie", role: "Product Owner" },
  ]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>React Components Demo</h1>

      {/* UserList erhält Daten und Titel vollständig über Props.
          Dadurch ist die Komponente problemlos in anderen Kontexten wiederverwendbar. */}
      <UserList title="Team" users={users} />

      {/* Counter wird mit einem Startwert und einem Label konfiguriert.
          Jeder Counter-Instanz hätte ihren eigenen, unabhängigem State. */}
      <Counter initialValue={0} label="Klickzähler" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Unidirektionaler Datenfluss + Events
 * ---------------------------------------------------------------------------
 * Ziel:
 * - State liegt im Parent.
 * - Parent gibt den aktuellen Wert als Props an das Child.
 * - Child kann den Wert nicht direkt ändern, sondern löst nur Events aus.
 * - Parent reagiert auf Events, ändert den State und rendert neu.
 *
 * Merksatz: Props down, events up.
 * ------------------------------------------------------------------------- */

interface CounterPropsUniDirectional {
  count: number;              // aktueller Wert kommt vom Parent
  label: string;              // reine Anzeige-Info
  onIncrement: () => void;    // Event-Callback: Änderung anfordern
  onDecrement: () => void;    // Event-Callback: Änderung anfordern
}

function ReactComponentsExampleUniDirectional() {
  const [count, setCount] = useState(0); // State gehört dem Parent

  return (
    <CounterExample
      label="Klickzähler"
      count={count} // Datenfluss nach unten (Parent -> Child)
      onIncrement={() => setCount(c => c + 1)} // Event-Handler im Parent
      onDecrement={() => setCount(c => c - 1)} // Parent ändert den State
    />
  );
}

function CounterExample({
  count,
  label,
  onIncrement,
  onDecrement,
}: CounterPropsUniDirectional) {
  return (
    <div>
      <p>{label}: {count}</p> {/* Child zeigt nur Props an */}
      <button onClick={onIncrement}>+1</button> {/* Events nach oben */}
      <button onClick={onDecrement}>-1</button> {/* Child fordert Änderung an */}
    </div>
  );
}