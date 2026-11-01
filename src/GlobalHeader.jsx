import { Link, useLocation } from "react-router-dom";
import InpactLogo from "./components/InpactLogo.jsx";
import { useAuth } from "./auth/useAuth.js";
import "./GlobalHeader.css";

// Routes that already render their own logo — we still show My tasks, but skip a second logo.
const ALREADY_BRANDED_PREFIXES = ["/lessons", "/join", "/try"];
const ALREADY_BRANDED_EXACT = new Set(["/", "/register"]);

function isAlreadyBranded(pathname) {
  return ALREADY_BRANDED_EXACT.has(pathname) || ALREADY_BRANDED_PREFIXES.some((p) => pathname.startsWith(p));
}

/**
 * Persistent corner chrome: brand (when the page doesn't already have one) + My tasks / Sign in.
 * Fixed-position so it never reflows page layouts.
 */
export default function GlobalHeader() {
  const location = useLocation();
  const { status } = useAuth();
  const branded = isAlreadyBranded(location.pathname);
  const onMyTasks = location.pathname === "/workbench";
  const signedIn = status === "signedIn";
  const googleHref = `/api/auth/google/start?returnTo=${encodeURIComponent("#/workbench")}`;

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
        {!signedIn && status !== "loading" ? (
          <a className="gh-nav-link gh-nav-link-google" href={googleHref}>
            Sign in with Google
          </a>
        ) : null}
      </nav>
    </header>
  );
}
