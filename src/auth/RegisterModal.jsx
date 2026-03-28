import { useState } from "react";
import { setRegistered, FREE_LESSONS_AFTER_REGISTER, MAX_FREE_UNREGISTERED } from "./lessonAccess.js";
import { isFirebaseConfigured, signInWithGoogle } from "./firebase.js";

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  fontFamily: "'DM Sans', sans-serif",
};
const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px 32px",
  maxWidth: "420px",
  width: "90%",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};
const title = { fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" };
const sub = { fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: 1.5 };
const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  marginBottom: "12px",
};
const btn = (primary) => ({
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  background: primary ? "#00d4ff" : "transparent",
  color: primary ? "#052545" : "#64748b",
  border: primary ? "none" : "1px solid #e2e8f0",
  marginTop: "8px",
});
const hardCallout = {
  marginBottom: "20px",
  padding: "14px 16px",
  background: "rgba(0,212,255,0.12)",
  borderLeft: "4px solid #00d4ff",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#0f172a",
  lineHeight: 1.55,
};
const errText = { fontSize: "12px", color: "#dc2626", marginTop: "-8px", marginBottom: "8px" };

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
}
function isValidPhone(s) {
  const digits = (s || "").replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}
function isValidEmailOrPhone(s) {
  const t = (s || "").trim();
  return isValidEmail(t) || isValidPhone(t);
}

export default function RegisterModal({ onSuccess, onClose, variant = "soft", voluntary = false }) {
  const isHard = variant === "hard";
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) return;
    setGoogleError("");
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      setRegistered({
        name: user.displayName || user.email?.split("@")[0] || "User",
        emailOrPhone: user.email || "",
      });
      onSuccess?.();
    } catch (err) {
      setGoogleError(err?.message || "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    const n = name.trim();
    const eop = emailOrPhone.trim();
    if (n.length < 2) {
      setSubmitError("Name must be at least 2 characters.");
      return;
    }
    if (!isValidEmailOrPhone(eop)) {
      setSubmitError("Enter a valid email (e.g. you@example.com) or phone number (10–15 digits).");
      return;
    }
    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }
    setRegistered({ name: n, emailOrPhone: eop });
    onSuccess?.();
  };

  const handleContinueWithoutRegistering = () => {
    onClose?.();
  };

  const softGateSub = `You’re opening one of your last free lessons before we ask for an account (${MAX_FREE_UNREGISTERED} unique lessons in any order, then we need to know you). Register to save progress — or continue for now. After you register, you get ${FREE_LESSONS_AFTER_REGISTER} more free lessons.`;
  const softVoluntarySub =
    "Sign in with Google or create an account with email. Registered learners unlock more free lessons and saved progress.";

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isHard && onClose) onClose();
      }}
    >
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <div style={title}>
          {isHard ? "Time to register" : voluntary ? "Log in or register" : "Register (optional for now)"}
        </div>
        {isHard ? (
          <div style={hardCallout} role="alert">
            Sorry, friend — you say that all the time. Why don&apos;t you register if you like our lessons and get{" "}
            {FREE_LESSONS_AFTER_REGISTER} more free lessons?
          </div>
        ) : (
          <div style={sub}>{voluntary ? softVoluntarySub : softGateSub}</div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
            autoComplete="name"
          />
          <input
            type="text"
            placeholder="Email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            style={input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            autoComplete="new-password"
          />
          {submitError && (
            <div style={errText} role="alert">
              {submitError}
            </div>
          )}
          <button type="submit" style={btn(true)} disabled={!name.trim() || !emailOrPhone.trim() || !password}>
            Register
          </button>
          {!isHard && !voluntary && (
            <button type="button" style={btn(false)} onClick={handleContinueWithoutRegistering}>
              Continue without registering
            </button>
          )}
        </form>
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Or register with </span>
          {isFirebaseConfigured ? (
            <button
              type="button"
              style={{ ...btn(true), width: "auto", display: "inline-block", marginLeft: "8px" }}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? "Signing in…" : "Google"}
            </button>
          ) : (
            <button type="button" style={{ ...btn(false), width: "auto", display: "inline-block", marginLeft: "8px" }} disabled title="Set VITE_FIREBASE_* in .env">
              Google (set up Firebase)
            </button>
          )}
          {googleError && (
            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "8px" }}>{googleError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
