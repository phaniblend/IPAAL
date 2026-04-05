import { useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LandingPage, { LESSON_LIST, LESSON_LIST_REACT_TS_LIVE } from './LandingPage'
import { ENGINES_TS } from './engines/react-ts/enginesTsLocked'
import { AI_LESSONS_CONFIG } from './ai-lessons/config.js'
import DynamicLessonPage from './ai-lessons/DynamicLessonPage.jsx'
import { LessonValidationContext } from './ai-lessons/lessonValidationContext.jsx'
import {
  mustSoftRegisterToAccess,
  mustHardRegisterToAccess,
  mustLoginToUnlockPastAnonymousLimit,
  mustPayToAccess,
  getSoftGateKind,
  hasEverRegistered,
  getFreeLessonsRemaining,
  getAnonymousFreeSlotsRemaining,
  recordLessonAccess,
  deductLessonPayment,
  getBalanceCents,
  getLessonPriceCents,
  TOTAL_FREE_LESSONS,
  MAX_FREE_UNREGISTERED,
  getStoredUser,
  logout,
  getRegisterDismissCount,
  incrementRegisterDismissCount,
  savePendingLesson,
  peekPendingLesson,
  clearPendingLesson,
} from './auth/lessonAccess.js'
import {
  buildLessonPath,
  parseLessonPath,
  setStoredRedirectPath,
  getStoredRedirectPath,
  clearStoredRedirectPath,
  getHashRoutePathname,
} from './auth/redirectPath.js'
import RegisterModal from './auth/RegisterModal.jsx'
import AddFundsModal from './auth/AddFundsModal.jsx'
import UserDashboard from './auth/UserDashboard.jsx'
import { addAppUsageSeconds } from './auth/appUsageTime.js'
import CinematicLanding from './CinematicLanding.jsx'
import {
  onAuthStateChange,
  getSession,
  upsertProfile,
  signOut as supabaseSignOut,
  recordLessonStart,
  recordLessonComplete,
  isSupabaseConfigured,
  isSupabaseAuthUserId,
} from './auth/supabase.js'
import { signOutFirebase } from './auth/firebase.js'
import { setRegistered as setRegisteredLocal } from './auth/lessonAccess.js'
import { LEARNER_FOCUS_TRACK } from './auth/learnerFocus.js'

/** Live branch: only React · TS locked engines are bundled. */
const ALGO_AI_TRACKS = ['algo-js', 'algo-ts', 'algo-python', 'algo-java']

function getEngines(track) {
  if (track === 'react-ts') return ENGINES_TS
  return []
}

function getLessonList(track) {
  if (track === 'react-ts') return null
  return null
}

function defaultReactFamilyLessonList(track) {
  if (track === 'react-ts') return LESSON_LIST_REACT_TS_LIVE.map((title) => ({ title }))
  return LESSON_LIST.map((title) => ({ title }))
}

function lessonTitleItemForReactFamily(track, index) {
  if (track !== 'react-ts') return null
  return LESSON_LIST_REACT_TS_LIVE[index] != null ? { title: LESSON_LIST_REACT_TS_LIVE[index] } : null
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [track, setTrack] = useState(LEARNER_FOCUS_TRACK)
  const [lessonTrack, setLessonTrack] = useState(null) // track locked when lesson is opened (so React TS lesson never uses react-js)
  const [lessonIndex, setLessonIndex] = useState(null) // null = landing, 0-based index = lesson
  const [selectedLessonItem, setSelectedLessonItem] = useState(null) // { title, shortName?, why? } when a card is clicked
  const [useAILessonFailed, setUseAILessonFailed] = useState(false) // fallback to local engine when AI path fails
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  /** Supabase emailed a recovery link; user must set a new password before normal sync. */
  const [passwordRecoveryActive, setPasswordRecoveryActive] = useState(false)
  /** 'soft' = dismissible; 'hard' = must register; 'startFree' = first-run CTA (Google / email / guest). */
  const [registerModalVariant, setRegisterModalVariant] = useState('soft')
  const [showAddFundsModal, setShowAddFundsModal] = useState(false)
  const [pendingLesson, setPendingLesson] = useState(null) // { track, index, item } when gated
  const [welcomeBonusMessage, setWelcomeBonusMessage] = useState('')
  const [user, setUser] = useState(() => getStoredUser())
  /** Full page load / refresh always shows the intro; we do not persist “already seen” in sessionStorage (that skipped it on every refresh). */
  const [showCinematic, setShowCinematic] = useState(() => {
    if (typeof window === 'undefined') return true
    const p = getHashRoutePathname()
    return !p.startsWith('/lessons/') && p !== '/register'
  })
  /** false until first Supabase getSession() finishes — avoids lesson gates before localStorage mirrors session. */
  const [authSessionReady, setAuthSessionReady] = useState(!isSupabaseConfigured)

  const lessonGateOpts = useMemo(() => ({ loggedIn: Boolean(user?.id) }), [user?.id])
  const softGateKindForModal = useMemo(() => {
    if (registerModalVariant !== 'soft' || !pendingLesson) return null
    return getSoftGateKind(pendingLesson.track, pendingLesson.index, lessonGateOpts)
  }, [registerModalVariant, pendingLesson, lessonGateOpts])
  const freeLessonsHint = useMemo(() => {
    if (user?.id) {
      const r = getFreeLessonsRemaining({ loggedIn: true })
      return r != null ? `${r}/${TOTAL_FREE_LESSONS} free lessons left` : null
    }
    if (hasEverRegistered()) return null
    const left = getAnonymousFreeSlotsRemaining()
    return `${left} of ${MAX_FREE_UNREGISTERED} anonymous free lessons left`
  }, [user?.id])
  const showWelcomeBackBanner = hasEverRegistered() && !user?.id
  const showRegBonusToast = Boolean(user?.id && welcomeBonusMessage)
  const catalogTopPadding =
    38 + (showWelcomeBackBanner ? 44 : 0) + (showRegBonusToast ? 44 : 0)
  /** Track + list index for the open lesson (for Supabase progress). */
  const activeLessonTrack = useMemo(
    () => (lessonIndex != null && lessonTrack != null ? lessonTrack : track),
    [lessonIndex, lessonTrack, track]
  )
  const lessonOpenedAtRef = useRef(null)

  const openLesson = useCallback(
    (idx, item, trackOverride) => {
      clearPendingLesson()
      clearStoredRedirectPath()
      const t = trackOverride ?? track
      setLessonTrack(t)
      recordLessonAccess(t, idx)
      setLessonIndex(idx)
      setSelectedLessonItem(item ?? null)
      setUseAILessonFailed(false)
      setPendingLesson(null)
      navigate(buildLessonPath(t, idx), { replace: true })
    },
    [track, navigate]
  )

  const goToVoluntaryRegister = useCallback(() => {
    setPendingLesson(null)
    clearStoredRedirectPath()
    setRegisterModalVariant('soft')
    setLessonIndex(null)
    setSelectedLessonItem(null)
    setLessonTrack(null)
    setUseAILessonFailed(false)
    navigate('/register')
  }, [navigate])

  // Supabase: subscribe, await getSession(), mirror to localStorage, then allow lesson clicks.
  // Resume lesson via useLayoutEffect (peekPendingLesson) or redirectPath after email sign-in.
  useEffect(() => {
    const syncUserFromSession = (session) => {
      if (!session?.user) return
      const u = session.user
      const profile = {
        name:
          u.user_metadata?.full_name ||
          u.user_metadata?.display_name ||
          u.email?.split('@')[0] ||
          'User',
        emailOrPhone: u.email || '',
        id: u.id,
        avatarUrl: u.user_metadata?.avatar_url || '',
      }
      setRegisteredLocal(profile)
      setUser(profile)
      // Avoid calling supabase.* inside the auth callback lock (can stall auth); see gotrue-js #762.
      queueMicrotask(() => {
        void upsertProfile(u)
      })
      setPasswordRecoveryActive(false)
      setShowRegisterModal(false)
      setShowCinematic(false)
      const rp = getStoredRedirectPath()
      clearStoredRedirectPath()
      if (rp) navigate(rp, { replace: true })
    }

    if (!isSupabaseConfigured) return undefined

    /** Legacy implicit redirect puts type=recovery in the hash. Do not treat ?code= as recovery — PKCE uses code= for magic link & email confirm too. */
    const recoveryInUrl = () => {
      if (typeof window === 'undefined') return false
      const { hash, search } = window.location
      return hash.includes('type=recovery') || /[?&]type=recovery/.test(search)
    }

    let passwordRecoveryFromListener = false
    let unsub = () => {}
    const authReadyTimeout = window.setTimeout(() => setAuthSessionReady(true), 10000)
    ;(async () => {
      const { data } = onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          passwordRecoveryFromListener = false
          logout()
          setUser(null)
          clearStoredRedirectPath()
          setPasswordRecoveryActive(false)
          return
        }
        if (event === 'PASSWORD_RECOVERY' && session?.user) {
          passwordRecoveryFromListener = true
          setPasswordRecoveryActive(true)
          setShowRegisterModal(true)
          setShowCinematic(false)
          return
        }
        if (session?.user) {
          syncUserFromSession(session)
        }
      })
      unsub = () => data.subscription.unsubscribe()
      // Let PASSWORD_RECOVERY (and URL exchange) run before we mirror session from getSession().
      await new Promise((r) => setTimeout(r, 0))
      await new Promise((r) => setTimeout(r, 0))
      let session = await getSession()
      if (session?.user && !passwordRecoveryFromListener && !recoveryInUrl()) syncUserFromSession(session)
      await new Promise((r) => setTimeout(r, 0))
      session = await getSession()
      if (session?.user && !passwordRecoveryFromListener && !recoveryInUrl()) syncUserFromSession(session)
      window.clearTimeout(authReadyTimeout)
      setAuthSessionReady(true)
    })()

    return () => {
      window.clearTimeout(authReadyTimeout)
      unsub()
    }
  }, [navigate])

  useLayoutEffect(() => {
    if (!user?.id) return
    if (parseLessonPath(location.pathname)) {
      clearPendingLesson()
      return
    }
    const p = peekPendingLesson()
    if (lessonIndex !== null) {
      if (p) clearPendingLesson()
      return
    }
    if (!p || typeof p.index !== 'number' || !p.track) return
    if (p.track !== LEARNER_FOCUS_TRACK) {
      clearPendingLesson()
      return
    }
    setLessonTrack(p.track)
    recordLessonAccess(p.track, p.index)
    setLessonIndex(p.index)
    setSelectedLessonItem(p.item ?? null)
    setUseAILessonFailed(false)
    setPendingLesson(null)
    setShowCinematic(false)
    setShowRegisterModal(false)
    clearPendingLesson()
    navigate(buildLessonPath(p.track, p.index), { replace: true })
  }, [user?.id, lessonIndex, location.pathname, navigate])

  useEffect(() => {
    if (!authSessionReady) return
    const parsed = parseLessonPath(location.pathname)
    if (!parsed) return
    if (!user?.id) {
      const t = parsed.track
      const i = parsed.index
      const list = getLessonList(t)
      const item = list?.[i] ?? lessonTitleItemForReactFamily(t, i)
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('loginWall')
      setShowRegisterModal(true)
      if (location.pathname !== '/register') navigate('/register', { replace: true })
      return
    }
    if (parsed.track !== LEARNER_FOCUS_TRACK) {
      navigate('/', { replace: true })
      return
    }

    setShowCinematic(false)
    const { track: t, index: i } = parsed
    setTrack(t)
    const list = getLessonList(t)
    const item = list?.[i] ?? lessonTitleItemForReactFamily(t, i)

    const opts = { loggedIn: Boolean(user?.id) }

    if (mustLoginToUnlockPastAnonymousLimit(t, i, opts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('loginWall')
      setShowRegisterModal(true)
      if (location.pathname !== '/register') navigate('/register', { replace: true })
      return
    }
    if (mustHardRegisterToAccess(t, i, opts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('hard')
      setShowRegisterModal(true)
      if (location.pathname !== '/register') navigate('/register', { replace: true })
      return
    }
    if (mustSoftRegisterToAccess(t, i, opts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('soft')
      setShowRegisterModal(true)
      if (location.pathname !== '/register') navigate('/register', { replace: true })
      return
    }
    if (mustPayToAccess(t, i, opts)) {
      if (getBalanceCents() >= getLessonPriceCents()) {
        deductLessonPayment()
        openLesson(i, item, t)
        return
      }
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setShowAddFundsModal(true)
      return
    }
    openLesson(i, item, t)
  }, [location.pathname, authSessionReady, user?.id, openLesson, navigate])

  useEffect(() => {
    if (location.pathname === '/register') {
      setShowCinematic(false)
      setShowRegisterModal(true)
    }
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/dashboard') return
    setShowCinematic(false)
    setLessonIndex(null)
    setSelectedLessonItem(null)
    setLessonTrack(null)
    setTrack(LEARNER_FOCUS_TRACK)
  }, [location.pathname])

  useEffect(() => {
    if (lessonIndex !== null) return
    if (parseLessonPath(location.pathname)) return
    setTrack(LEARNER_FOCUS_TRACK)
  }, [lessonIndex, location.pathname])

  useEffect(() => {
    if (!user?.id) return undefined
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') addAppUsageSeconds(user.id, 15)
    }, 15000)
    return () => clearInterval(id)
  }, [user?.id])

  const handleLessonComplete = useCallback(() => {
    const uid = user?.id
    if (!uid || !isSupabaseConfigured || !isSupabaseAuthUserId(uid) || lessonIndex == null) return
    const opened = lessonOpenedAtRef.current
    const sec = opened ? Math.max(0, Math.round((Date.now() - opened) / 1000)) : 0
    void recordLessonComplete(uid, activeLessonTrack, lessonIndex, sec)
  }, [user?.id, lessonIndex, activeLessonTrack, isSupabaseConfigured])

  useEffect(() => {
    if (!user?.id || !isSupabaseConfigured || !isSupabaseAuthUserId(user.id) || lessonIndex == null) return
    const t = activeLessonTrack
    const idx = lessonIndex
    const list = getLessonList(t) ?? defaultReactFamilyLessonList(t)
    const title = selectedLessonItem?.title ?? list?.[idx]?.title ?? ''
    lessonOpenedAtRef.current = Date.now()
    void recordLessonStart(user.id, t, idx, title)
  }, [user?.id, lessonIndex, activeLessonTrack, selectedLessonItem?.title, isSupabaseConfigured])

  const onBackToLessons = () => {
    setLessonIndex(null)
    setSelectedLessonItem(null)
    setLessonTrack(null)
    setUseAILessonFailed(false)
    setPendingLesson(null)
    setTrack(LEARNER_FOCUS_TRACK)
    navigate('/', { replace: true })
  }

  const handleStartFree = (i, item) => {
    const t = LEARNER_FOCUS_TRACK
    if (user?.id) {
      handleSelectLesson(i, item)
      return
    }
    setPendingLesson({ track: t, index: i, item })
    savePendingLesson(t, i, item)
    setStoredRedirectPath(buildLessonPath(t, i))
    setRegisterModalVariant('startFree')
    setShowRegisterModal(true)
    navigate('/register', { replace: true })
  }

  const handleSelectLesson = (i, item) => {
    const t = LEARNER_FOCUS_TRACK
    if (!user?.id) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('loginWall')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustLoginToUnlockPastAnonymousLimit(t, i, lessonGateOpts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('loginWall')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustHardRegisterToAccess(t, i, lessonGateOpts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('hard')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustSoftRegisterToAccess(t, i, lessonGateOpts)) {
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setRegisterModalVariant('soft')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustPayToAccess(t, i, lessonGateOpts)) {
      if (getBalanceCents() >= getLessonPriceCents()) {
        deductLessonPayment()
        openLesson(i, item, t)
        return
      }
      setPendingLesson({ track: t, index: i, item })
      savePendingLesson(t, i, item)
      setStoredRedirectPath(buildLessonPath(t, i))
      setShowAddFundsModal(true)
      return
    }
    openLesson(i, item, t)
  }

  const registerSuccess = (meta) => {
    setUser(getStoredUser())
    setShowRegisterModal(false)
    setRegisterModalVariant('soft')
    const pl = pendingLesson
    clearPendingLesson()
    setPendingLesson(null)
    if (meta?.flow === 'register' || meta?.flow === 'google') {
      const r = getFreeLessonsRemaining({ loggedIn: true })
      if (r != null && r > 0) {
        setWelcomeBonusMessage(
          `You have ${r} included lesson${r === 1 ? '' : 's'} left before paid lessons.`
        )
        window.setTimeout(() => setWelcomeBonusMessage(''), 12000)
      }
    }
    if (pl && pl.track === LEARNER_FOCUS_TRACK) openLesson(pl.index, pl.item, pl.track)
  }

  const registerModalDismiss = () => {
    incrementRegisterDismissCount()
    setShowRegisterModal(false)
    setRegisterModalVariant('soft')
    const pl = pendingLesson
    clearPendingLesson()
    setPendingLesson(null)
    if (location.pathname === '/register') navigate('/', { replace: true })
    if (pl && pl.track === LEARNER_FOCUS_TRACK) openLesson(pl.index, pl.item, pl.track)
  }

  const startFreeGuestContinue = () => {
    setShowRegisterModal(false)
    setRegisterModalVariant('soft')
    const pl = pendingLesson
    clearPendingLesson()
    setPendingLesson(null)
    if (location.pathname === '/register') navigate('/', { replace: true })
    if (pl && pl.track === LEARNER_FOCUS_TRACK) openLesson(pl.index, pl.item, pl.track)
  }

  const registerModalOnClose = passwordRecoveryActive
    ? undefined
    : registerModalVariant === 'soft'
      ? registerModalDismiss
      : registerModalVariant === 'startFree'
        ? startFreeGuestContinue
        : undefined

  const handleLogout = async () => {
    await supabaseSignOut()
    try {
      await signOutFirebase()
    } catch {
      /* ignore */
    }
    logout()
    setUser(null)
  }

  const authBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#0f172a',
  }
  const authBtnStyle = {
    background: '#ffffff',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#0f172a',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    padding: '6px 14px',
  }

  const addFundsDone = () => {
    setShowAddFundsModal(false)
    if (pendingLesson && getBalanceCents() >= getLessonPriceCents()) {
      deductLessonPayment()
      openLesson(pendingLesson.index, pendingLesson.item, pendingLesson.track)
    }
    setPendingLesson(null)
  }

  const lessonPathFromUrl = parseLessonPath(location.pathname)
  if (!authSessionReady && !lessonPathFromUrl) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#e2e8f0',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '14px',
        }}
      >
        Signing you in…
      </div>
    )
  }

  if (location.pathname === '/dashboard') {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            padding: '6px 14px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <button type="button" style={authBtnStyle} onClick={() => navigate('/', { replace: true })}>
            ← All lessons
          </button>
          <div style={authBarStyle}>
            {user ? (
              <>
                <span>Hi, {user.name || user.emailOrPhone || 'User'}</span>
                <button type="button" style={authBtnStyle} onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                style={{ ...authBtnStyle, borderColor: '#00d4ff', color: '#052545', background: '#00d4ff' }}
                onClick={goToVoluntaryRegister}
              >
                Log in
              </button>
            )}
          </div>
        </div>
        <div style={{ paddingTop: '38px' }}>
          <UserDashboard user={user} />
        </div>
        {showRegisterModal && (
          <RegisterModal
            variant={registerModalVariant}
            voluntary={!pendingLesson}
            dismissCount={getRegisterDismissCount()}
            softGateKind={softGateKindForModal}
            onSuccess={registerSuccess}
            onClose={registerModalOnClose}
            passwordRecovery={passwordRecoveryActive}
            onPasswordRecoveryComplete={() => {
              setPasswordRecoveryActive(false)
              setShowRegisterModal(false)
            }}
          />
        )}
        {showAddFundsModal && <AddFundsModal user={user} onDone={addFundsDone} />}
      </>
    )
  }

  if (lessonIndex === null) {
    if (showCinematic) {
      return (
        <CinematicLanding
          onEnterLessons={() => {
            setTrack(LEARNER_FOCUS_TRACK)
            setShowCinematic(false)
          }}
        />
      )
    }

    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            padding: '6px 14px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <div style={{ ...authBarStyle, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {user ? (
                <button type="button" style={authBtnStyle} onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
              ) : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user ? (
                <>
                  <span>Hi, {user.name || user.emailOrPhone || 'User'}</span>
                  <button type="button" style={authBtnStyle} onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={{ ...authBtnStyle, borderColor: '#00d4ff', color: '#052545', background: '#00d4ff' }}
                  onClick={goToVoluntaryRegister}
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
        {showWelcomeBackBanner ? (
          <div
            role="status"
            style={{
              position: 'fixed',
              top: '38px',
              left: 0,
              right: 0,
              zIndex: 9997,
              padding: '10px 14px',
              background: '#ecfeff',
              borderBottom: '1px solid #67e8f9',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#0c4a6e',
              textAlign: 'center',
              lineHeight: 1.45,
            }}
          >
            Welcome back! Log in to continue with any remaining included lessons on this browser.
          </div>
        ) : null}
        {showRegBonusToast ? (
          <div
            role="status"
            style={{
              position: 'fixed',
              top: showWelcomeBackBanner ? '82px' : '38px',
              left: 0,
              right: 0,
              zIndex: 9997,
              padding: '10px 14px',
              background: '#d1fae5',
              borderBottom: '1px solid #6ee7b7',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#065f46',
              textAlign: 'center',
            }}
          >
            {welcomeBonusMessage}
          </div>
        ) : null}
        <div style={{ paddingTop: `${catalogTopPadding}px` }}>
          <LandingPage
            track={LEARNER_FOCUS_TRACK}
            onSelectLesson={handleSelectLesson}
            onStartFree={handleStartFree}
            lessonList={getLessonList(LEARNER_FOCUS_TRACK)}
            freeLessonsHint={freeLessonsHint}
          />
        </div>
        {showRegisterModal && (
          <RegisterModal
            variant={registerModalVariant}
            voluntary={!pendingLesson}
            dismissCount={getRegisterDismissCount()}
            softGateKind={softGateKindForModal}
            onSuccess={registerSuccess}
            onClose={registerModalOnClose}
            passwordRecovery={passwordRecoveryActive}
            onPasswordRecoveryComplete={() => {
              setPasswordRecoveryActive(false)
              setShowRegisterModal(false)
            }}
          />
        )}
        {showAddFundsModal && <AddFundsModal user={user} onDone={addFundsDone} />}
      </>
    )
  }

  // When viewing a lesson, use the track that was selected when they opened it (lessonTrack) so React TS never gets react-js content.
  const effectiveTrack = (lessonIndex != null && lessonTrack != null) ? lessonTrack : track
  const lessonList = getLessonList(effectiveTrack) ?? defaultReactFamilyLessonList(effectiveTrack)
  const engines = getEngines(effectiveTrack)
  const Engine = engines[lessonIndex]

  const onNextLesson = () => {
    const next = Math.min(lessonIndex + 1, engines.length - 1)
    if (next === lessonIndex) return
    if (mustLoginToUnlockPastAnonymousLimit(effectiveTrack, next, lessonGateOpts)) {
      const nextItem = lessonList[next] ?? null
      setLessonIndex(null)
      setSelectedLessonItem(null)
      setLessonTrack(null)
      setUseAILessonFailed(false)
      setPendingLesson({ track: effectiveTrack, index: next, item: nextItem })
      savePendingLesson(effectiveTrack, next, nextItem)
      setStoredRedirectPath(buildLessonPath(effectiveTrack, next))
      setRegisterModalVariant('loginWall')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustHardRegisterToAccess(effectiveTrack, next, lessonGateOpts)) {
      const nextItem = lessonList[next] ?? null
      setLessonIndex(null)
      setSelectedLessonItem(null)
      setLessonTrack(null)
      setUseAILessonFailed(false)
      setPendingLesson({ track: effectiveTrack, index: next, item: nextItem })
      savePendingLesson(effectiveTrack, next, nextItem)
      setStoredRedirectPath(buildLessonPath(effectiveTrack, next))
      setRegisterModalVariant('hard')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustSoftRegisterToAccess(effectiveTrack, next, lessonGateOpts)) {
      const nextItem = lessonList[next] ?? null
      setLessonIndex(null)
      setSelectedLessonItem(null)
      setLessonTrack(null)
      setUseAILessonFailed(false)
      setPendingLesson({ track: effectiveTrack, index: next, item: nextItem })
      savePendingLesson(effectiveTrack, next, nextItem)
      setStoredRedirectPath(buildLessonPath(effectiveTrack, next))
      setRegisterModalVariant('soft')
      setShowRegisterModal(true)
      navigate('/register', { replace: true })
      return
    }
    if (mustPayToAccess(effectiveTrack, next, lessonGateOpts)) {
      if (getBalanceCents() >= getLessonPriceCents()) {
        deductLessonPayment()
        openLesson(next, lessonList[next] ?? null)
        return
      }
      setPendingLesson({ track: effectiveTrack, index: next, item: lessonList[next] ?? null })
      savePendingLesson(effectiveTrack, next, lessonList[next] ?? null)
      setStoredRedirectPath(buildLessonPath(effectiveTrack, next))
      setShowAddFundsModal(true)
      return
    }
    openLesson(next, lessonList[next] ?? null)
  }
  const useAILessons = AI_LESSONS_CONFIG.useAILessons && !useAILessonFailed
  const lessonTitle = selectedLessonItem?.title ?? lessonList[lessonIndex]?.title ?? `Lesson ${lessonIndex + 1}`
  const hasStaticEngine = Boolean(engines[lessonIndex])
  const useDynamicLesson = effectiveTrack === 'mobile-angular' || ALGO_AI_TRACKS.includes(effectiveTrack) || (useAILessons || !hasStaticEngine)

  if (useDynamicLesson) {
    return (
      <>
        {/* Top bar: left/center transparent so Lesson/Editor/Output tabs are visible; header (bg + border) only behind name + login */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            padding: '10px 16px',
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={onBackToLessons}
              style={{
                background: 'rgb(5, 37, 67)',
                border: 'none',
                borderRadius: '6px',
                color: '#00d4ff',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                padding: '6px 12px',
              }}
            >
              ← All Lessons
            </button>
            {effectiveTrack && (
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                {({ 'react-js': 'React · JS', 'react-ts': 'React · TS', angular: 'Angular', 'mobile-angular': 'Mobile Angular', vue: 'Vue', js: 'JavaScript', ts: 'TypeScript', node: 'Node', express: 'Express', python: 'Python', css: 'CSS', sd: 'System Design', pe: 'Production Eng', sec: 'Security', el: 'Eng Leadership', fe: 'Frontend Eng', 'algo-js': 'Algo · JS', 'algo-ts': 'Algo · TS', 'algo-python': 'Algo · Python', 'algo-java': 'Algo · Java' })[effectiveTrack] ?? effectiveTrack}
              </span>
            )}
            {user ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'rgb(5, 37, 67)',
                  border: '1px solid #00d4ff',
                  borderRadius: '6px',
                  color: '#00d4ff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '6px 12px',
                }}
              >
                Dashboard
              </button>
            ) : null}
          </div>
          <div
            style={{
              pointerEvents: 'auto',
              background: '#ffffff',
              borderBottom: '1px solid #0f172a',
              borderLeft: '1px solid #0f172a',
              borderBottomLeftRadius: '8px',
              padding: '8px 16px',
              margin: '-10px -16px -10px 0',
            }}
          >
            <div style={authBarStyle}>
              {user ? (
                <>
                  <span>Hi, {user.name || user.emailOrPhone || 'User'}</span>
                  <button type="button" style={authBtnStyle} onClick={handleLogout}>
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={{ ...authBtnStyle, borderColor: '#00d4ff', color: '#052545', background: '#00d4ff' }}
                  onClick={goToVoluntaryRegister}
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
        <LessonValidationContext.Provider
          value={{
            track: effectiveTrack,
            lessonIndex: lessonIndex,
            lessonTitle: lessonTitle ?? '',
            lessonKey: `${effectiveTrack}:${lessonIndex}:${lessonTitle ?? ''}`,
          }}
        >
          <DynamicLessonPage
            track={lessonTrack ?? track}
            lessonTitle={lessonTitle}
            lessonIndex={lessonIndex}
            onBackToLessons={onBackToLessons}
            onNextLesson={onNextLesson}
            onLessonComplete={user?.id ? handleLessonComplete : undefined}
            onFallbackToLocal={AI_LESSONS_CONFIG.fallbackToLocalOnError ? () => setUseAILessonFailed(true) : undefined}
          />
        </LessonValidationContext.Provider>
        {showRegisterModal && (
          <RegisterModal
            variant={registerModalVariant}
            voluntary={!pendingLesson}
            dismissCount={getRegisterDismissCount()}
            softGateKind={softGateKindForModal}
            onSuccess={registerSuccess}
            onClose={registerModalOnClose}
            passwordRecovery={passwordRecoveryActive}
            onPasswordRecoveryComplete={() => {
              setPasswordRecoveryActive(false)
              setShowRegisterModal(false)
            }}
          />
        )}
        {showAddFundsModal && <AddFundsModal user={user} onDone={addFundsDone} />}
      </>
    )
  }

  if (!Engine) {
    return (
      <>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, padding: '12px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', fontFamily: "'DM Sans', sans-serif", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" onClick={onBackToLessons} style={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', padding: '8px 14px' }}>← All Lessons</button>
            {user ? (
              <button type="button" style={authBtnStyle} onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
            ) : null}
          </div>
          <div style={authBarStyle}>
            {user ? (
              <>
                <span>Hi, {user.name || user.emailOrPhone || 'User'}</span>
                <button type="button" style={authBtnStyle} onClick={handleLogout}>
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                style={{ ...authBtnStyle, borderColor: '#00d4ff', color: '#052545', background: '#00d4ff' }}
                onClick={goToVoluntaryRegister}
              >
                Log in
              </button>
            )}
          </div>
        </div>
        <div style={{ paddingTop: '52px', textAlign: 'center', padding: '48px' }}>Select a lesson from the list.</div>
        {showRegisterModal && (
          <RegisterModal
            variant={registerModalVariant}
            voluntary={!pendingLesson}
            dismissCount={getRegisterDismissCount()}
            softGateKind={softGateKindForModal}
            onSuccess={registerSuccess}
            onClose={registerModalOnClose}
            passwordRecovery={passwordRecoveryActive}
            onPasswordRecoveryComplete={() => {
              setPasswordRecoveryActive(false)
              setShowRegisterModal(false)
            }}
          />
        )}
        {showAddFundsModal && <AddFundsModal user={user} onDone={addFundsDone} />}
      </>
    )
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          padding: '12px 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          fontFamily: "'DM Sans', sans-serif",
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={onBackToLessons}
            style={{
              background: '#0f172a',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              padding: '8px 14px',
            }}
          >
            ← All Lessons
          </button>
          {effectiveTrack && (
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              {({ 'react-js': 'React · JS', 'react-ts': 'React · TS', angular: 'Angular', 'mobile-angular': 'Mobile Angular', vue: 'Vue', js: 'JavaScript', ts: 'TypeScript', node: 'Node', express: 'Express', python: 'Python', css: 'CSS', sd: 'System Design', pe: 'Production Eng', sec: 'Security', el: 'Eng Leadership', fe: 'Frontend Eng', 'algo-js': 'Algo · JS', 'algo-ts': 'Algo · TS', 'algo-python': 'Algo · Python', 'algo-java': 'Algo · Java' })[effectiveTrack] ?? effectiveTrack}
            </span>
          )}
          {user ? (
            <button type="button" style={authBtnStyle} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          ) : null}
        </div>
        <div style={authBarStyle}>
          {user ? (
            <>
              <span>Hi, {user.name || user.emailOrPhone || 'User'}</span>
              <button type="button" style={authBtnStyle} onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              style={{ ...authBtnStyle, borderColor: '#00d4ff', color: '#052545', background: '#00d4ff' }}
              onClick={goToVoluntaryRegister}
            >
              Log in
            </button>
          )}
        </div>
      </div>
      <LessonValidationContext.Provider
        value={{
          track: effectiveTrack,
          lessonIndex: lessonIndex,
          lessonTitle: lessonTitle ?? '',
          lessonKey: `${effectiveTrack}:${lessonIndex}:${lessonTitle ?? ''}`,
        }}
      >
        <Engine
          onNextLesson={lessonIndex < engines.length - 1 ? onNextLesson : undefined}
          onBackToLessons={onBackToLessons}
          onLessonComplete={user?.id ? handleLessonComplete : undefined}
        />
      </LessonValidationContext.Provider>
      {showRegisterModal && (
        <RegisterModal
          variant={registerModalVariant}
          voluntary={!pendingLesson}
          dismissCount={getRegisterDismissCount()}
          softGateKind={softGateKindForModal}
          onSuccess={registerSuccess}
          onClose={registerModalOnClose}
          passwordRecovery={passwordRecoveryActive}
          onPasswordRecoveryComplete={() => {
            setPasswordRecoveryActive(false)
            setShowRegisterModal(false)
          }}
        />
      )}
      {showAddFundsModal && <AddFundsModal user={user} onDone={addFundsDone} />}
    </>
  )
}