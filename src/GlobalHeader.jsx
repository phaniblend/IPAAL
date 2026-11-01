import { Link, useLocation } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import "./GlobalHeader.css";

// Routes that already render their own logo — we still show My tasks, but skip a second logo.
const ALREADY_BRANDED_PREFIXES = ["/lessons", "/join", "/try"];
const ALREADY_BRANDED_EXACT = new Set(["/", "/register"]);

function isAlreadyBranded(pathname) {
  return ALREADY_BRANDED_EXACT.has(pathname) || ALREADY_BRANDED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Persistent corner chrome: brand (when the page doesn't already have one) + My tasks.
 * Fixed-position so it never reflows page layouts.
 */
export default function GlobalHeader() {
  const location = useLocation();
  const branded = isAlreadyBranded(location.pathname);
  const onMyTasks = location.pathname === "/workbench";

  return (
    <header className="gh-bar" aria-label="Inpact">
      {!branded ? (
        <Link to="/" className="gh-logo-link" aria-label="Inpact home">
          <InpactLogo height={44} />
        </Link>
      ) : (
        <span className="gh-logo-spacer" aria-hidden />
      )}
      <nav className="gh-nav">
        <Link
          to="/workbench"
          className={`gh-nav-link${onMyTasks ? " gh-nav-link-active" : ""}`}
        >
          My tasks
        </Link>
      </nav>
    </header>
  );
}
