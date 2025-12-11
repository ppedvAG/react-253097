import { Routes, Route, Link, useParams } from "react-router-dom";
import styles from "./ReactRoutingExample.module.css";

/* ---------------------------------------------------------------------------
 * Domänenmodell & Mock-Daten
 * ------------------------------------------------------------------------- */

// Einfache Struktur für ein Buch-Objekt, wie es in der Bücher-Ansicht verwendet wird.
// In einer realen App könnte dies aus einer API stammen oder in einem separaten Modul liegen.
interface Book {
  id: string;
  title: string;
  description: string;
}

// Kleine In-Memory-"Datenbank" für Bücher.
// Die IDs werden später als URL-Parameter verwendet (/products/books/:bookId).
const books: Book[] = [
  {
    id: "react-intro",
    title: "React Einführung",
    description: "Ein Einstieg in Komponenten, Props und State.",
  },
  {
    id: "react-hooks",
    title: "React Hooks",
    description: "useState, useEffect und weitere moderne React-Features.",
  },
  {
    id: "react-routing",
    title: "React Routing",
    description: "Navigation und URL-Struktur mit React Router.",
  },
];

/* ---------------------------------------------------------------------------
 * Seiten-Komponenten (Route-Targets)
 * ------------------------------------------------------------------------- */

// Startseite (Route: "/")
// Zeigt eine einfache Begrüßung und verweist auf die Navigation.
function HomePage() {
  return (
    <section>
      <h2>Startseite</h2>
      <p>
        Willkommen in der kleinen React-Routing-Demo. Nutze die Navigation, um
        zwischen den Seiten zu wechseln.
      </p>
    </section>
  );
}

// Produktübersicht (Route: "/products")
// Dient hier nur als Beispiel-Seite und leitet weiter zur Bücher-Übersicht.
function ProductsPage() {
  return (
    <section>
      <h2>Produkte</h2>
      <p>Hier könnten unterschiedliche Produktkategorien stehen.</p>
      <p>
        Speziell für Bücher:{" "}
        {/* Link sorgt für client-seitige Navigation ohne vollständigen Page-Reload */}
        <Link to="/products/books">Zur Bücher-Übersicht</Link>
      </p>
    </section>
  );
}

// Bücherübersicht (Route: "/products/books")
// Listet alle Bücher auf und erzeugt für jedes einen Link zur Detailseite.
function BooksPage() {
  return (
    <section>
      <h2>Bücher</h2>
      <p>Wähle ein Buch aus, um Details zu sehen:</p>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {/* Link mit dynamischem URL-Segment /products/books/:bookId.
               Die book.id wird später in BookDetailPage über useParams ausgelesen. */}
            <Link to={`/products/books/${book.id}`}>{book.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Buchdetailseite (Route: "/products/books/:bookId")
// Liest die bookId aus der URL und sucht das passende Buch in der books-Liste.
function BookDetailPage() {
  // useParams gibt ein Objekt mit allen Route-Parametern zurück.
  // Durch das Generic <{ bookId: string }> wird der Parameter typsicher gemacht.
  const { bookId } = useParams<{ bookId: string }>();

  // Buch anhand der ID aus den Mock-Daten ermitteln.
  const book = books.find((b) => b.id === bookId);

  // Wenn keine Übereinstimmung gefunden wurde (z.B. manuelle URL-Eingabe),
  // wird eine einfache Fehlerseite angezeigt.
  if (!book) {
    return (
      <section>
        <h2>Buch nicht gefunden</h2>
        <p>
          Das angeforderte Buch existiert nicht.{" "}
          <Link to="/products/books">Zurück zur Übersicht</Link>
        </p>
      </section>
    );
  }

  // Erfolgsfall: Buch gefunden, Detailinformationen werden angezeigt.
  return (
    <section>
      <h2>{book.title}</h2>
      <p>{book.description}</p>
      <p>
        <Link to="/products/books">Zurück zur Bücher-Übersicht</Link>
      </p>
    </section>
  );
}

// Fallback-Seite für nicht gematchte Routen (Route: "*")
// Wird immer dann angezeigt, wenn keine der definierten Route-Definitionen zutrifft.
function NotFoundPage() {
  return (
    <section>
      <h2>Seite nicht gefunden</h2>
      <p>
        Die aufgerufene URL existiert nicht.{" "}
        <Link to="/">Zurück zur Startseite</Link>
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Hauptbeispiel-Komponente für App.tsx
 * ------------------------------------------------------------------------- */

// Hauptkomponente, die alle Routen und Navigationselemente zusammenbringt.
// WICHTIG: Diese Komponente muss innerhalb eines <BrowserRouter> (oder
// vergleichbaren Router-Komponenten) gerendert werden, damit Links & Routes funktionieren.
export function ReactRoutingExample() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>React Routing Demo</h1>
        <p className={styles.subtitle}>
          Navigation mit <code>Link</code>, <code>Routes</code> und{" "}
          <code>Route</code>.
        </p>
      </header>

      {/* Hauptnavigation innerhalb der Single Page Application.
         Die Links entsprechen den wichtigsten Routen. */}
      <nav className={styles.nav}>
        <Link className={styles.navLink} to="/">
          Start
        </Link>
        <Link className={styles.navLink} to="/products">
          Produkte
        </Link>
        <Link className={styles.navLink} to="/products/books">
          Bücher
        </Link>
      </nav>

      {/* Bereich, in dem abhängig von der aktuellen URL die passende Seite
         gerendert wird. Routes/Route sind die v6-API von react-router-dom. */}
      <main className={styles.main}>
        <Routes>
          {/* Exakte Startseite */}
          <Route path="/" element={<HomePage />} />

          {/* Statische Route für die Produktübersicht */}
          <Route path="/products" element={<ProductsPage />} />

          {/* Statische Route für die Bücherübersicht */}
          <Route path="/products/books" element={<BooksPage />} />

          {/* Dynamische Route mit Parameter :bookId für Buchdetails */}
          <Route path="/products/books/:bookId" element={<BookDetailPage />} />

          {/* Fallback-Route: fängt alle nicht definierten Pfade ab */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
