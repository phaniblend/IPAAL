/**
 * Infer a short analogous React+TS snippet for "SHOW ME AN EXAMPLE" when a lesson
 * step has no `example_code`. Uses different identifiers than typical lesson answers
 * so learners see the pattern, not copy-paste solutions.
 */

export function inferReactTsAnalogousExample(node) {
  const paal = String(node?.paal || "");
  const hint = String(node?.hint || "");
  const expected = String(node?.expected || "");
  const text = `${paal}\n${hint}\n${expected}`;
  const t = text.toLowerCase();

  if (!text.trim()) return null;

  // Boolean toggle "function only" (no button wiring yet) — show just the toggle function body.
  // This avoids learners copying a full component when they only need the pattern for setX(prev => !prev).
  const isToggleLanguage =
    /toggle\s+handler|toggle\s+visibility|flip\s+(display|visibility|flag)|flip\s+the\s+flag|set\w+\([^)]*=>[^)]*!\w+\)/.test(t) ||
    (/\bboolean\b/.test(t) && /\bset\w+\b/.test(t) && /\bprev\b/.test(t) && t.includes("!"));
  const hasButtonWiring = /<button\b/.test(t) || /\bonclick\b/.test(t) || /onClick\s*=/.test(t);
  if (isToggleLanguage && !hasButtonWiring) {
    return `const flipVisibility = () => setSeeme((prev) => !prev)`;
  }

  // RTK Query / Redux Toolkit slice-style APIs
  if (/\bcreateapi\b|fetchbasequery|builder\.query|builder\.mutation|reducerpath|tagtypes/.test(t)) {
    return `// Different endpoint names; same RTK Query shape:
export const otherApi = createApi({
  reducerPath: 'otherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (build) => ({
    getItems: build.query<Item[], void>({ query: () => 'items' }),
  }),
})`;
  }

  if (/\busereducer\b/.test(t)) {
    return `type CounterAction = { type: 'inc' } | { type: 'dec' }
function tallyReducer(state: number, action: CounterAction) {
  switch (action.type) {
    case 'inc': return state + 1
    case 'dec': return state - 1
    default: return state
  }
}
const [tally, dispatchTally] = useReducer(tallyReducer, 0)`;
  }

  if (/\busememo\b/.test(t)) {
    return `const sorted = useMemo(() => {
  return [...items].sort((a, b) => a.label.localeCompare(b.label))
}, [items])`;
  }

  if (/\busecallback\b/.test(t)) {
    return `const bump = useCallback(() => {
  setCount((c) => c + 1)
}, [])`;
  }

  if (/\busecontext\b|\bcreatecontext\b|\bcontext\.provider\b/.test(t)) {
    return `const PaletteCtx = createContext<string | null>(null)
// Consumer: const tone = useContext(PaletteCtx)`;
  }

  if (/\buseref\b/.test(t) && !/\buseeffect\b/.test(t)) {
    return `const boxRef = useRef<HTMLDivElement | null>(null)
// boxRef.current?.focus()`;
  }

  // useState + useEffect (count / numeric)
  if (/\buseeffect\b/.test(t) && /\busestate\b/.test(t) && /\b(count|numeric|number)\b/.test(t)) {
    return `const [ticks, setTicks] = useState<number>(0)
useEffect(() => {
  console.log('ticks:', ticks)
}, [ticks])`;
  }

  if (/\buseeffect\b/.test(t) && /\babortcontroller\b|abort\b.*signal|\bfetch\b.*\bsignal\b/.test(t)) {
    return `useEffect(() => {
  const ac = new AbortController()
  fetch('/api/example', { signal: ac.signal }).catch(() => {})
  return () => ac.abort()
}, [])`;
  }

  if (/\buseeffect\b/.test(t) && /\bcleanup\b|\breturn\s*\(\)\s*=>\s*\{/.test(t)) {
    return `useEffect(() => {
  document.title = 'Demo'
  return () => {
    document.title = ''
  }
}, [])`;
  }

  if (/\buseeffect\b/.test(t)) {
    return `useEffect(() => {
  console.log('level:', level)
}, [level])  // deps list every value from state/props the effect reads`;
  }

  // Multiple string fields / forms
  if (/\bname\b.*\bemail\b.*\bpassword\b.*\bconfirm/.test(t)) {
    return `// Fictitious names — same idea as your lesson:
const [alias, setAlias] = useState<string>('')
const [mailbox, setMailbox] = useState<string>('')
const [secret, setSecret] = useState<string>('')
const [secretDup, setSecretDup] = useState<string>('')`;
  }

  if (/\bseparate\b.*\bstring\b|\bemail\b.*\bpassword\b|\btwo\b.*\busestate<string>/.test(t)) {
    return `const [handle, setHandle] = useState<string>('')
const [secret, setSecret] = useState<string>('')`;
  }

  if (/\bfour\b.*\b(controlled|input|string|field)\b/.test(t)) {
    return `const [alias, setAlias] = useState<string>('')
const [mailbox, setMailbox] = useState<string>('')
const [secret, setSecret] = useState<string>('')
const [secretDup, setSecretDup] = useState<string>('')
// Then bind four <input>s with value={...} and onChange={e => set...(e.target.value)}`;
  }

  if (/\btwo\b.*\b(controlled|input)\b/.test(t)) {
    return `<input
  value={handle}
  onChange={(e) => setHandle(e.target.value)}
/>
<input
  type="password"
  value={secret}
  onChange={(e) => setSecret(e.target.value)}
/>`;
  }

  // Button + functional update (before boolean-only state)
  if (
    (/\bbutton\b/.test(t) && /\bonclick\b/.test(t)) ||
    /\btoggle\b.*\bhandler\b|\bfunctional update\b|\bflip\b.*\b(value|flag|visible)\b/.test(t)
  ) {
    return `<button type="button" onClick={() => setFlag((prev) => !prev)}>
  Toggle
</button>`;
  }

  // Controlled input
  if (
    /\bcontrolled\b/.test(t) ||
    (/\bvalue=\{/.test(hint) && /\bonchange\b/.test(t)) ||
    /\bchangeevent\b.*htmlinputelement|\bonchange=.*target\.value/.test(t)
  ) {
    return `<input
  value={caption}
  onChange={(e) => setCaption(e.target.value)}
/>`;
  }

  // Boolean / visibility / toggle state (fictitious names — not the lesson’s variables)
  if (
    /\busestate<boolean>/.test(t) ||
    (/\b(boolean|toggle|visibility|visible)\b/.test(t) && /\bstate\b/.test(t))
  ) {
    return "const [seeme, setSeeme] = useState<boolean>(true)";
  }

  // String state
  if (
    /\busestate<string>/.test(t) ||
    (/\bstring\b/.test(t) && /\bstate\b/.test(t) && (/\bempty\b|initialize|define\s+and\s+create/.test(t)))
  ) {
    return "const [caption, setCaption] = useState<string>('')";
  }

  // Numeric state
  if (/\busestate<number>|\bnumeric\b.*\bstate\b|\bcount\b.*\b(initialized|initialize)/.test(t)) {
    return "const [total, setTotal] = useState<number>(0)";
  }

  // Password match / conditional message
  if (/\bpasswords\b.*\bmatch\b|\bmatch\b.*\bpassword\b/.test(t)) {
    return `{secret === secretDup ? <p>Aligned</p> : <p>Not aligned</p>}`;
  }

  // Conditional render
  if (/\bconditional\b.*\brender\b|only\s+while\s+\w+\s+is|show.*while.*visible/.test(t)) {
    return `{isOpen && <p>You can see this.</p>}`;
  }

  // Props / FC
  if (/\binterface\b.*props|react\.fc<|react\.functionalcomponent/.test(text)) {
    return `type BannerProps = { label: string }
export const Banner: React.FC<BannerProps> = ({ label }) => <header>{label}</header>`;
  }

  // List / keys
  if (/\bmap\b.*\bkey=|\bkeyboard\b.*\blist\b|\bul\b.*\bli\b/.test(t)) {
    return `{items.map((row) => (
  <li key={row.id}>{row.title}</li>
))}`;
  }

  if (/\busetransition\b/.test(t)) {
    return `const [pending, startTransition] = useTransition()
startTransition(() => setFilter(nextFilter))`;
  }

  if (/\busedeferredvalue\b/.test(t)) {
    return `const deferredQuery = useDeferredValue(query)
// Read from deferredQuery in expensive child props`;
  }

  if (/\blazy\b|\bsuspense\b/.test(t)) {
    return `const Panel = lazy(() => import('./Panel'))
// <Suspense fallback={<p>…</p>}><Panel /></Suspense>`;
  }

  if (/\breact\.memo\b|\bmemo\s*\(/.test(t)) {
    return `const Tile = memo(function Tile({ label }: { label: string }) {
  return <span>{label}</span>
})`;
  }

  if (/\bforwardref\b/.test(t)) {
    return `const Box = forwardRef<HTMLDivElement, { label: string }>(function Box({ label }, ref) {
  return <div ref={ref}>{label}</div>
})`;
  }

  if (/\buseimperativehandle\b/.test(t)) {
    return `useImperativeHandle(ref, () => ({
  focus: () => innerRef.current?.focus(),
}), [])`;
  }

  if (/\busesyncexternalstore\b/.test(t)) {
    return `const width = useSyncExternalStore(
  subscribeWindowResize,
  () => window.innerWidth,
  () => 0,
)`;
  }

  // Generic “scaffold” objectives (placeholder lessons)
  if (
    /\binitial setup\b|\bcore implementation\b|\bcomplete\b.*lesson\b/.test(t) ||
    (/\bstructure\b|\btemplate\b/.test(t) && /\bstate\b/.test(t) && /\blesson\b/.test(t))
  ) {
    return `// Small typed slice you can grow:
const [draft, setDraft] = useState<string>('')
// Then wire JSX and handlers to match the task.`;
  }

  return null;
}
