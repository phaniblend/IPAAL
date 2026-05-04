import { useState, useCallback } from 'react'

/** Persisted dismissal; cleared when learner finishes cinematic so orientation can run again. */
export const REACT_TS_PATTERNS_BRIDGE_STORAGE_KEY = 'inpact.reactTs.patternsBridge.v1'

export function isReactTsPatternsBridgeDismissed() {
  if (typeof window === 'undefined') return true
  try {
    return window.localStorage.getItem(REACT_TS_PATTERNS_BRIDGE_STORAGE_KEY) === '1'
  } catch {
    return true
  }
}

/** Matches LandingPage / app shell: white field, cyan CTA, dusty brick-rose accents. */
const LP = {
  bg: '#ffffff',
  text: '#0f172a',
  muted: '#475569',
  subtle: '#64748b',
  cyan: '#00d4ff',
  cyanText: '#052545',
  brick: '#c97b7b',
  brickBorder: '#dfa8a3',
  brickTint: 'rgba(201, 123, 123, 0.14)',
  line: '#f1f5f9',
  card: '#f8fafc',
}

const PATTERN_MAP_BLOCKS = [
  {
    title: 'Cards',
    line: 'Show one thing at a glance — a name, a status, a number.',
    example: 'Example: a product tile, a user profile chip, an order summary.',
  },
  {
    title: 'Lists',
    line: 'Show many things you can scan — row after row of the same shape.',
    example: 'Example: all your orders, all your contacts, all open support tickets.',
  },
  {
    title: 'Detail view',
    line: 'Zoom into one row and show everything about it.',
    example: 'Example: click one order → see every line item, every note, every status change.',
  },
  {
    title: 'Forms',
    line: 'Let someone type, choose, and submit — the moment data actually changes.',
    example: 'Example: book an appointment, edit a profile, submit a payment.',
  },
  {
    title: 'Dashboards',
    line: 'Step back and see the big picture — trends, totals, comparisons.',
    example: 'Example: sales this month vs last month, across every region.',
  },
  {
    title: 'Actions',
    line: 'Buttons and flows that do something permanent everyone else will see.',
    example: 'Example: approve a request, send a reminder, archive a record.',
  },
  {
    title: 'Permissions',
    line: 'Decide who can see or change what.',
    example: 'Example: admin can edit everything, guest can only read.',
  },
]

const SEVEN_BLOCKS_EXAMPLES = [
  'A card that shows one grocery item at a glance.',
  'A list that shows everything in the kitchen.',
  'A form to add or update stock.',
  'An action to flag something as expired.',
  'A permission that stops a new hire from deleting records.',
]

const btnPrimary = {
  border: 'none',
  borderRadius: '10px',
  padding: '12px 22px',
  fontSize: '15px',
  fontWeight: 700,
  cursor: 'pointer',
  background: LP.cyan,
  color: LP.cyanText,
}

const btnSecondary = {
  border: `2px solid ${LP.brickBorder}`,
  borderRadius: '10px',
  padding: '12px 20px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  background: LP.bg,
  color: LP.text,
}

const kicker = {
  margin: '0 0 10px',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: LP.cyan,
  fontWeight: 700,
}

/**
 * Post-cinematic orientation: Screen 1 — pattern map (seven blocks); Screen 2 — concrete restaurant problem → blocks.
 * Dismissal is persisted in localStorage (`REACT_TS_PATTERNS_BRIDGE_STORAGE_KEY`).
 *
 * @param {() => void} [onComplete] — After bridge is marked seen: show the lesson catalogue only.
 * @param {() => void} [onOpenLesson1] — After bridge is marked seen: open React · TS lesson 1 (same gates as picking card 01).
 */
export default function ReactTsPatternsBridge({ onComplete, onOpenLesson1 }) {
  const [screen, setScreen] = useState(0)

  const markBridgeDismissed = useCallback(() => {
    try {
      window.localStorage.setItem(REACT_TS_PATTERNS_BRIDGE_STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
  }, [])

  const finishToCatalog = useCallback(() => {
    markBridgeDismissed()
    onComplete?.()
  }, [markBridgeDismissed, onComplete])

  const finishToLesson1 = useCallback(() => {
    markBridgeDismissed()
    onOpenLesson1?.()
  }, [markBridgeDismissed, onOpenLesson1])

  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: 'clamp(20px, 4vw, 48px)',
        background: `radial-gradient(100% 60% at 100% 0%, ${LP.brickTint} 0%, transparent 52%), radial-gradient(90% 50% at 0% 100%, rgba(0, 212, 255, 0.06) 0%, transparent 50%), ${LP.bg}`,
        color: LP.text,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 'min(100%, 720px)',
          borderTop: `3px solid ${LP.cyan}`,
          boxShadow: `inset 0 1px 0 0 ${LP.line}`,
          paddingTop: '8px',
        }}
      >
        {screen === 0 ? (
          <>
            <p style={kicker}>The Pattern Map</p>
            <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(24px, 4vw, 32px)', lineHeight: 1.2, fontWeight: 700, color: LP.text }}>
              Almost every web app you have ever used is built from the same seven building blocks.
            </h1>
            <p style={{ margin: '0 0 14px', fontSize: '16px', lineHeight: 1.65, color: LP.muted }}>
            The team behind every email app uses them. So does every ride-booking 
app, every hotel reservation platform, and every banking dashboard 
you have ever opened. Once you can recognize and build each one, you 
can build any enterprise app — not because you memorized a framework, 
but because you understand the shape of the problem.</p>
            <p style={{ margin: '0 0 18px', fontSize: '16px', lineHeight: 1.65, fontWeight: 600, color: LP.text }}>
              Here are the seven:
            </p>
            <ul
              style={{
                margin: '0 0 22px',
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {PATTERN_MAP_BLOCKS.map((p, i) => (
                <li
                  key={p.title}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: `1px solid ${LP.line}`,
                    borderLeft: `3px solid ${i % 2 === 0 ? LP.cyan : LP.brick}`,
                    background: LP.card,
                    boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '15px', color: LP.text, marginBottom: '6px' }}>{p.title}</div>
                  <div style={{ fontSize: '14px', lineHeight: 1.55, color: LP.muted, marginBottom: '4px' }}>{p.line}</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.5, color: LP.subtle }}>{p.example}</div>
                </li>
              ))}
            </ul>
            <p style={{ margin: '0 0 26px', fontSize: '15px', lineHeight: 1.65, color: LP.muted }}>
              You do not need to memorize these names right now. Just notice: almost every screen you build in this
              course will be one of these — or a combination of two.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <button type="button" onClick={() => setScreen(1)} style={btnPrimary}>
                Continue
              </button>
            </div>
          </>
        ) : null}

        {screen === 1 ? (
          <>
            <p
              style={{
                margin: '0 0 6px',
                fontSize: '12px',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: LP.cyan,
              }}
            >
              Screen 2
            </p>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(22px, 3.5vw, 28px)', lineHeight: 1.25, fontWeight: 700, color: LP.text }}>
              Apply it to a real problem
            </h2>
            <p style={{ margin: '0 0 14px', fontSize: '17px', lineHeight: 1.55, fontWeight: 600, color: LP.text }}>
              Let&apos;s try this on something concrete.
            </p>
            <p style={{ margin: '0 0 16px', fontSize: '16px', lineHeight: 1.65, color: LP.muted }}>
              Imagine a restaurant owner who is losing money because the kitchen team has no idea what is in stock,
              what is running low, or what expired yesterday.
            </p>
            <p style={{ margin: '0 0 14px', fontSize: '16px', lineHeight: 1.65, fontWeight: 600, color: LP.text }}>
              Could you build an app that solves that?
            </p>
            <p style={{ margin: '0 0 18px', fontSize: '16px', lineHeight: 1.65, color: LP.muted }}>
              You actually can — and every screen you would need maps to one of those seven building blocks:
            </p>
            <ul
              style={{
                margin: '0 0 22px',
                padding: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {SEVEN_BLOCKS_EXAMPLES.map((line, i) => (
                <li
                  key={line}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${LP.line}`,
                    borderLeft: `3px solid ${i % 2 === 0 ? LP.cyan : LP.brick}`,
                    background: LP.card,
                    fontSize: '15px',
                    lineHeight: 1.55,
                    color: LP.muted,
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
            <p style={{ margin: '0 0 26px', fontSize: '16px', lineHeight: 1.65, color: LP.muted }}>
              That is the app you are going to build in this course — one building block at a time, starting with a
              single card.
            </p>
            <p style={{ margin: '0 0 22px', fontSize: '17px', lineHeight: 1.5, fontWeight: 700, color: LP.text }}>
              Ready to build the first one?
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <button
                type="button"
                onClick={finishToLesson1}
                style={{ ...btnPrimary, padding: '14px 26px', fontSize: '16px' }}
              >
                Open lesson 1
              </button>
              <button type="button" onClick={finishToCatalog} style={btnSecondary}>
                View all lessons
              </button>
            </div>
            <button
              type="button"
              onClick={() => setScreen(0)}
              style={{
                marginTop: '0',
                display: 'block',
                border: 'none',
                background: 'none',
                color: LP.brick,
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              Back to the pattern map
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}
