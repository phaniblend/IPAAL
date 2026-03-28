import { useState } from "react";
import { setRegistered, FREE_LESSONS_AFTER_REGISTER, MAX_FREE_UNREGISTERED } from "./lessonAccess.js";
import { isSupabaseConfigured, signInWithGoogle as supabaseGoogleSignIn } from "./supabase.js";

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
const titleStyle = { fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" };
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
    if (!isSupabaseConfigured) return;
    setGoogleError("");
    setGoogleLoading(true);
    try {
      await supabaseGoogleSignIn();
    } catch (err) {
      setGoogleError(err?.message || "Google sign-in failed");
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
      setSubmitError("Enter a valid email (e.g. you@example.com) or phone number (10\u201315 digits).");
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

  const softGateSub = `You're opening one of your last free lessons before we ask for an account (${MAX_FREE_UNREGISTERED} unique lessons in any order, then we need to know you). Register to save progress \u2014 or continue for now. After you register, you get ${FREE_LESSONS_AFTER_REGISTER} more free lessons.`;
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
        <div style={titleStyle}>
          {isHard ? "Time to register" : voluntary ? "Log in or register" : "Register (optional for now)"}
        </div>
        {isHard ? (
          <div style={hardCallout} role="alert">
            Sorry, friend &mdash; you say that all the time. Why don&apos;t you register if you like our lessons and get{" "}
            {FREE_LESSONS_AFTER_REGISTER} more free lessons?
          </div>
        ) : (
          <div style={sub}>{voluntary ? softVoluntarySub : softGateSub}</div>
        )}

        {/* Google sign-in button — prominent at top */}
        <div style={{ marginBottom: "16px" }}>
          {isSupabaseConfigured ? (
            <button
              type="button"
              style={{
                ...btn(true),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "15px",
                padding: "14px 16px",
                borderRadius: "10px",
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.03 24.03 0 0 0 0 21.56l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              {googleLoading ? "Signing in\u2026" : "Continue with Google"}
            </button>
          ) : (
            <button type="button" style={{ ...btn(false), width: "100%" }} disabled title="Set VITE_SUPABASE_* in .env">
              Google (configure Supabase)
            </button>
          )}
          {googleError && (
            <div style={{ fontSize: "12px", color: "#dc2626", marginTop: "8px", textAlign: "center" }}>{googleError}</div>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", margin: "8px 0 16px" }}>
          &mdash; or register with email &mdash;
        </div>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={input} autoComplete="name" />
          <input type="text" placeholder="Email or phone" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} style={input} autoComplete="username" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} autoComplete="new-password" />
          {submitError && <div style={errText} role="alert">{submitError}</div>}
          <button type="submit" style={btn(true)} disabled={!name.trim() || !emailOrPhone.trim() || !password}>
            Register
          </button>
          {!isHard && !voluntary && (
            <button type="button" style={btn(false)} onClick={handleContinueWithoutRegistering}>
              Continue without registering
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
