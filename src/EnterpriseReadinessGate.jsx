import InpactLogo from './components/InpactLogo.jsx'

/**
 * Shown once, right after the cinematic intro's "Start doing" click and before we commit to either
 * path — this is the fork between IPF's real-work track (SpecForge tasks, matched by trade/skill,
 * reviewed like a real PR) and the plain self-paced lesson catalog (the existing restaurant-
 * management-themed modules). Same visual language as LandingPage.jsx's LP tokens: light background,
 * DM Sans, cyan (#00d4ff / #0891b2) accents — deliberately not the cinematic canvas, since this is a
 * real decision point, not a hook.
 */
export default function EnterpriseReadinessGate({ onApply, onJustLessons }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#ffffff',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%', maxWidth: '620px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <InpactLogo height={72} />
        </div>

        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '10px',
          }}
        >
          Before you start
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.25,
            margin: '0 0 18px',
          }}
        >
          This isn&apos;t a typical React course.
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#334155', margin: '0 0 14px' }}>
          Most lessons here stop at teaching React syntax. Ours don&apos;t — they&apos;re built to give you{' '}
          <strong style={{ color: '#0f172a', fontWeight: 600 }}>real enterprise dev-environment readiness</strong>:
          real tasks matched to your trade and level, real code review, real tooling — the kind of experience you can
          point to with a reference for what you actually built here, not just a certificate for lessons completed.
        </p>

        <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#334155', margin: '0 0 26px' }}>
          That path starts with a short application so we can match you to real, open work. If you&apos;d rather just
          learn React at your own pace first, that&apos;s here too — no application needed.
        </p>

        <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: '0 0 20px' }}>
          Do you want to continue? It's absolutely free forever.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={onApply}
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '13px 22px',
              background: '#0891b2',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Yes, I&apos;ll apply
          </button>
          <button
            type="button"
            onClick={onJustLessons}
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '11px 22px',
              background: 'transparent',
              color: '#0891b2',
              border: '2px solid #00d4ff',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            No, I just want React lessons
          </button>
        </div>
      </div>
    </div>
  )
}
