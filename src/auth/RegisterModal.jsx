import { useState } from "react";
import {
  setRegistered,
  FREE_LESSONS_AFTER_REGISTER,
  hasEverRegistered,
} from "./lessonAccess.js";
import {
  isSupabaseConfigured,
  signUpWithEmail,
  signInWithEmail,
  sendPasswordResetEmail,
  updateUserPassword,
  getUser,
} from "./supabase.js";

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
const inputStyle = {
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
const successBox = {
  textAlign: "center",
  padding: "20px 0",
};
const successIcon = {
  fontSize: "48px",
  marginBottom: "16px",
};
const successTitle = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: "8px",
};
const successSub = {
  fontSize: "14px",
  color: "#64748b",
  lineHeight: 1.6,
  marginBottom: "20px",
};
const tabRow = {
  display: "flex",
  gap: "0",
  marginBottom: "20px",
  borderBottom: "2px solid #e2e8f0",
};
const tab = (active) => ({
  flex: 1,
  padding: "10px 0",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  background: "none",
  border: "none",
  borderBottom: active ? "2px solid #00d4ff" : "2px solid transparent",
  color: active ? "#0f172a" : "#94a3b8",
  marginBottom: "-2px",
});
const linkBtn = {
  background: "none",
  border: "none",
  color: "#0369a1",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  marginTop: "10px",
  padding: 0,
  textAlign: "left",
  textDecoration: "underline",
};

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
}

function getDismissButtonText(dismissCount) {
  if (dismissCount >= 1) return "I promise, I'll do it for the next lesson";
  return "I'll register later";
}

/** Map Supabase Auth errors to a short line + optional setup hint for operators. */
function mapSignUpError(err) {
  const raw = (err?.message || "").trim();
  const lower = raw.toLowerCase();
  if (
    lower.includes("confirmation email") ||
    lower.includes("error sending") ||
    (lower.includes("send") && lower.includes("email")) ||
    lower.includes("smtp") ||
    lower === "email rate limit exceeded"
  ) {
    return {
      message: "Couldn\u2019t send the confirmation email.",
      hint:
        "Your Supabase project must be able to send mail. In the Supabase dashboard: Authentication \u2192 check Providers \u2192 Email; Project Settings \u2192 Auth \u2192 set up SMTP or use the built-in mailer within rate limits; Logs \u2192 Auth for the exact failure. For development only, you can turn off \u201cConfirm email\u201d under Authentication \u2192 Providers \u2192 Email so users can sign in immediately after register.",
    };
  }
  return { message: raw || "Sign-up failed. Please try again.", hint: "" };
}

export default function RegisterModal({
  onSuccess,
  onClose,
  variant = "soft",
  voluntary = false,
  dismissCount = 0,
  softGateKind = null,
  passwordRecovery = false,
  onPasswordRecoveryComplete,
}) {
  const isHard = variant === "hard";
  const isLoginWall = variant === "loginWall";
  const [mode, setMode] = useState(() => (isLoginWall ? "login" : "register"));
  const [loginAux, setLoginAux] = useState("form"); // form | forgot | forgotSent
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitErrorHint, setSubmitErrorHint] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitErrorHint("");
    const n = name.trim();
    const em = email.trim();
    if (n.length < 2) {
      setSubmitError("Name must be at least 2 characters.");
      return;
    }
    if (!isValidEmail(em)) {
      setSubmitError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }
    if (!isSupabaseConfigured) {
      setRegistered({ name: n, emailOrPhone: em });
      onSuccess?.({ flow: "register" });
      return;
    }
    setSubmitLoading(true);
    try {
      const data = await signUpWithEmail(em, password, n);
      if (data?.user?.identities?.length === 0) {
        setSubmitError("An account with this email already exists. Try logging in.");
        setSubmitLoading(false);
        return;
      }
      // If "Confirm email" is off in Supabase, you get a session immediately.
      if (data?.session?.user) {
        const user = data.session.user;
        setRegistered({
          id: user.id,
          name: user.user_metadata?.display_name || user.user_metadata?.full_name || n,
          emailOrPhone: user.email || em,
          avatarUrl: user.user_metadata?.avatar_url || "",
        });
        onSuccess?.({ flow: "register" });
        return;
      }
      setConfirmationEmail(em);
      setConfirmationSent(true);
    } catch (err) {
      const { message, hint } = mapSignUpError(err);
      setSubmitError(message);
      setSubmitErrorHint(hint);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitErrorHint("");
    const em = email.trim();
    if (!isValidEmail(em)) {
      setSubmitError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setSubmitError("Enter your password.");
      return;
    }
    if (!isSupabaseConfigured) {
      setRegistered({ name: em.split("@")[0], emailOrPhone: em });
      onSuccess?.({ flow: "login" });
      return;
    }
    setSubmitLoading(true);
    try {
      const data = await signInWithEmail(em, password);
      const user = data?.user;
      setRegistered({
        id: user?.id,
        name: user?.user_metadata?.display_name || user?.user_metadata?.full_name || em.split("@")[0],
        emailOrPhone: user?.email || em,
        avatarUrl: user?.user_metadata?.avatar_url || "",
      });
      onSuccess?.();
    } catch (err) {
      const msg = err?.message || "Login failed.";
      if (msg.includes("Email not confirmed")) {
        setSubmitError("Please confirm your email first. Check your inbox (and spam) for the confirmation link.");
      } else if (msg.includes("Invalid login credentials")) {
        setSubmitError("Invalid email or password.");
        setSubmitErrorHint(
          "Passwords are case-sensitive. If you already confirmed your email, try Forgot password. If you have not confirmed yet, use the link in your signup email first."
        );
      } else {
        setSubmitError(msg);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const dismissText = getDismissButtonText(dismissCount);

  const handleContinueWithoutRegistering = () => {
    onClose?.();
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitErrorHint("");
    const em = email.trim();
    if (!isValidEmail(em)) {
      setSubmitError("Enter a valid email address.");
      return;
    }
    setSubmitLoading(true);
    try {
      await sendPasswordResetEmail(em);
      setLoginAux("forgotSent");
    } catch (err) {
      setSubmitError(err?.message || "Could not send reset email.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePasswordRecoverySubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitErrorHint("");
    if (newPassword.length < 8) {
      setSubmitError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }
    setSubmitLoading(true);
    try {
      await updateUserPassword(newPassword);
      const user = await getUser();
      if (user) {
        setRegistered({
          id: user.id,
          name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          emailOrPhone: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || "",
        });
      }
      onSuccess?.({ flow: "login" });
      onPasswordRecoveryComplete?.();
    } catch (err) {
      setSubmitError(err?.message || "Could not update password.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const softGateSixSub = `Register to save your progress and unlock ${FREE_LESSONS_AFTER_REGISTER} more free lessons!`;
  const softGateEightSub = `Last chance! Register now to unlock ${FREE_LESSONS_AFTER_REGISTER} more free lessons.`;
  const softVoluntarySub = hasEverRegistered()
    ? "You've registered! Log in to access your remaining 7 free lessons."
    : "Log in or register with your email. Registered learners unlock more free lessons and saved progress.";
  const hardGateCallout = `You've reached the limit for anonymous lessons. Register to access ${FREE_LESSONS_AFTER_REGISTER} more free lessons!`;
  const loginWallCallout = `You've reached the limit for anonymous lessons. Log in to access your remaining ${FREE_LESSONS_AFTER_REGISTER} free lessons!`;

  if (passwordRecovery) {
    return (
      <div style={overlay} onClick={(e) => e.stopPropagation()}>
        <div style={card} onClick={(e) => e.stopPropagation()}>
          <div style={titleStyle}>Set a new password</div>
          <div style={sub}>Choose a password for your Inpact account, then you&apos;ll be signed in.</div>
          <form onSubmit={handlePasswordRecoverySubmit}>
            <input
              type="password"
              placeholder="New password (8+ characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
            {submitError && <div style={errText} role="alert">{submitError}</div>}
            <button type="submit" style={btn(true)} disabled={submitLoading || !newPassword || !confirmNewPassword}>
              {submitLoading ? "Saving\u2026" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (confirmationSent) {
    return (
      <div style={overlay}>
        <div style={card}>
          <div style={successBox}>
            <div style={successIcon}>&#9993;</div>
            <div style={successTitle}>Check your email</div>
            <div style={successSub}>
              We sent a confirmation link to <strong>{confirmationEmail}</strong>.
              <br />
              Click the link in the email to verify your account, then come back and log in.
              <br />
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Didn&apos;t get it? Check your spam folder.
              </span>
            </div>
            <button
              type="button"
              style={btn(true)}
              onClick={() => {
                setConfirmationSent(false);
                setMode("login");
                setPassword("");
              }}
            >
              Got it &mdash; take me to log in
            </button>
            {!isHard && !isLoginWall && (
              <button type="button" style={btn(false)} onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const modalTitle = isLoginWall
    ? "Log in to continue"
    : isHard
      ? "Create your account"
      : voluntary
        ? "Log in or register"
        : "Register (optional for now)";

  const modalSub = isLoginWall ? (
    <div style={hardCallout} role="alert">
      {loginWallCallout}
    </div>
  ) : isHard ? (
    <div style={hardCallout} role="alert">
      {hardGateCallout}
    </div>
  ) : voluntary ? (
    <div style={sub}>{softVoluntarySub}</div>
  ) : softGateKind === "eight" ? (
    <div style={sub}>{softGateEightSub}</div>
  ) : (
    <div style={sub}>{softGateSixSub}</div>
  );

  return (
    <div
      style={overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isHard && !isLoginWall && onClose) onClose();
      }}
    >
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>{modalTitle}</div>
        {modalSub}

        {!isSupabaseConfigured && (
          <div
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginBottom: "16px",
              padding: "10px 12px",
              background: "#f8fafc",
              borderRadius: "8px",
            }}
          >
            Supabase is not configured (set <code style={{ fontSize: "11px" }}>VITE_SUPABASE_*</code> in{" "}
            <code style={{ fontSize: "11px" }}>.env</code>). You can still register locally for testing.
          </div>
        )}

        {!isLoginWall ? (
          <div style={tabRow}>
            <button
              type="button"
              style={tab(mode === "register")}
              onClick={() => {
                setMode("register");
                setLoginAux("form");
                setSubmitError("");
                setSubmitErrorHint("");
              }}
            >
              Register
            </button>
            <button
              type="button"
              style={tab(mode === "login")}
              onClick={() => {
                setMode("login");
                setLoginAux("form");
                setSubmitError("");
                setSubmitErrorHint("");
              }}
            >
              Log in
            </button>
          </div>
        ) : null}

        {mode === "register" && !isLoginWall ? (
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} autoComplete="name" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
            <input type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="new-password" />
            {submitError && (
              <div role="alert">
                <div style={errText}>{submitError}</div>
                {submitErrorHint ? (
                  <div style={{ ...errText, color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{submitErrorHint}</div>
                ) : null}
              </div>
            )}
            <button type="submit" style={btn(true)} disabled={submitLoading || !name.trim() || !email.trim() || !password}>
              {submitLoading ? "Creating account\u2026" : "Register"}
            </button>
            {!isHard && !isLoginWall && !voluntary && (
              <button type="button" style={btn(false)} onClick={handleContinueWithoutRegistering}>
                {dismissText}
              </button>
            )}
          </form>
        ) : loginAux === "forgot" ? (
          <form onSubmit={handleForgotSubmit}>
            <div style={{ ...sub, marginTop: 0 }}>We&apos;ll email you a link to reset your password.</div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
            {submitError && <div style={errText} role="alert">{submitError}</div>}
            <button type="submit" style={btn(true)} disabled={submitLoading || !email.trim()}>
              {submitLoading ? "Sending\u2026" : "Send reset link"}
            </button>
            <button type="button" style={linkBtn} onClick={() => { setLoginAux("form"); setSubmitError(""); }}>
              Back to log in
            </button>
          </form>
        ) : loginAux === "forgotSent" ? (
          <div>
            <div style={successSub}>
              If an account exists for <strong>{email.trim()}</strong>, we sent a reset link. Check inbox and spam, then open the link on this same device/browser.
            </div>
            <button type="button" style={btn(true)} onClick={() => { setLoginAux("form"); setSubmitError(""); }}>
              Back to log in
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />
            {isSupabaseConfigured && (
              <button type="button" style={linkBtn} onClick={() => { setLoginAux("forgot"); setSubmitError(""); setSubmitErrorHint(""); }}>
                Forgot password?
              </button>
            )}
            {submitError && (
              <div role="alert">
                <div style={errText}>{submitError}</div>
                {submitErrorHint ? (
                  <div style={{ ...errText, color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{submitErrorHint}</div>
                ) : null}
              </div>
            )}
            <button type="submit" style={btn(true)} disabled={submitLoading || !email.trim() || !password}>
              {submitLoading ? "Logging in\u2026" : "Log in"}
            </button>
            {!isHard && !isLoginWall && !voluntary && (
              <button type="button" style={btn(false)} onClick={handleContinueWithoutRegistering}>
                {dismissText}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
