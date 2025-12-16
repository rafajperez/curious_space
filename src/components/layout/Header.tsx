import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-header">
      <nav className="nav-container">
        <Link href="/" className="logo-link">
          <span className="logo-icon">🌌</span>
          <span>Curious Space</span>
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-item">
            Início (APOD)
          </Link>
          <Link href="/mars" className="nav-item">
            Mars Rover
          </Link>
        </div>
      </nav>
    </header>
  );
}
