import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "JS — BLOCK C #1", title: "String Methods — The Complete Toolkit", body: `Strings are immutable in JavaScript — every method returns a NEW string.
This matters for performance and for understanding why reassignment is always needed.

The 30+ string methods fall into four categories:
  Search   — indexOf, includes, startsWith, endsWith, search, match, matchAll
  Extract  — slice, substring, split, at
  Transform — replace, replaceAll, trim, padStart, padEnd, repeat, toUpperCase
  Template — template literals, tagged templates, String.raw

Knowing which method to reach for — and the edge cases of each — is a daily skill.`, usecase: `Validation, slug generation, search highlighting, CSV parsing, URL manipulation, text formatting — string operations appear in every layer of a web app.` } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use slice vs substring — and why slice is preferred", "Search with indexOf vs includes vs match vs matchAll", "Use padStart/padEnd for formatting (IDs, times, tables)", "Use trimStart/trimEnd/trim and replaceAll", "Use at() for negative indexing", "Chain methods for readable text pipelines"] },
  {
    id: "step1", type: "question", phase: "Step 1 of 5",
    paal: "Compare slice vs substring. Show indexOf vs includes vs startsWith/endsWith for search.",
    answer_keywords: ["slice", "includes", "startsWith", "indexOf", "endsWith"],
    seed_code: `// Step 1: extraction and search

const str = 'Hello, World! Hello, JS!'

// EXTRACTION:
str.slice(7, 12)       // 'World' — slice(start, end)
str.slice(-3)          // 'JS!' — negative indices count from end ✅
str.slice(7)           // 'World! Hello, JS!'

// substring(start, end) — no negatives (treats them as 0):
str.substring(7, 12)   // 'World'
str.substring(-3)      // same as substring(0) = full string ← gotcha

// slice is preferred — handles negatives correctly

// SEARCH:
str.indexOf('Hello')       // 0  — first occurrence, -1 if not found
str.indexOf('Hello', 1)    // 14 — start search from index 1
str.lastIndexOf('Hello')   // 14 — last occurrence

str.includes('World')      // true  — boolean, cleaner than indexOf !== -1
str.startsWith('Hello')    // true
str.startsWith('World', 7) // true — check from position 7
str.endsWith('JS!')        // true
str.endsWith('Hello', 14)  // true — treat string as if it ends at 14

// search() — uses regex, returns index:
str.search(/World/i)   // 7

export {}`,
    feedback_correct: "✅ slice over substring (handles negatives). includes/startsWith/endsWith over indexOf for boolean checks.",
    feedback_partial: "slice(start,end) handles negatives. includes returns boolean. startsWith/endsWith for prefix/suffix.",
    feedback_wrong: "str.slice(-3) = last 3 chars. str.includes('x') = boolean. str.startsWith('Hello') = boolean.",
    expected: "slice and search methods",
  },
  {
    id: "step2", type: "question", phase: "Step 2 of 5",
    paal: "Use replace and replaceAll with string and regex patterns. Use match and matchAll for extracting all occurrences.",
    answer_keywords: ["replace", "replaceAll", "match", "matchAll", "regex", "global"],
    seed_code: `// Step 2: replace and match

const text = 'The cat sat on the mat with another cat'

// replace — only replaces FIRST occurrence with string pattern:
text.replace('cat', 'dog')    // 'The dog sat on the mat with another cat'

// replaceAll — replaces ALL occurrences (ES2021):
text.replaceAll('cat', 'dog') // 'The dog sat on the mat with another dog'

// replace with GLOBAL regex — also replaces all:
text.replace(/cat/g, 'dog')   // same as replaceAll
text.replace(/cat/gi, 'dog')  // case-insensitive too

// replace with a function — dynamic replacement:
text.replace(/cat/g, (match, offset) => match.toUpperCase())
// 'The CAT sat on the mat with another CAT'

// Capture groups in replacement:
'2024-01-15'.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
// '15/01/2024' — $1, $2, $3 are capture groups

// match — returns array of matches (or null):
text.match(/cat/g)    // ['cat', 'cat'] — global flag returns all
text.match(/cat/)     // ['cat', index: 4, ...] — without g, returns details
text.match(/xyz/)     // null — no match

// matchAll — returns iterator of all matches with full details:
const matches = [...text.matchAll(/cat/g)]
// [{0: 'cat', index: 4, ...}, {0: 'cat', index: 34, ...}]

export {}`,
    feedback_correct: "✅ replace replaces first. replaceAll or /regex/g replaces all. matchAll gives full details for every match.",
    feedback_partial: "replace with string: first only. replace with /g flag or replaceAll: all. matchAll: iterator of all.",
    feedback_wrong: "text.replaceAll('cat','dog')  |  text.replace(/cat/g, 'dog')  |  [...text.matchAll(/cat/g)]",
    expected: "replace, replaceAll, match, matchAll",
  },
  {
    id: "step3", type: "question", phase: "Step 3 of 5",
    paal: "Use padStart/padEnd for number formatting, trim variants, repeat, and at() for negative indexing.",
    answer_keywords: ["padStart", "padEnd", "trim", "at", "repeat", "negative"],
    seed_code: `// Step 3: formatting and utility methods

// padStart / padEnd — pad to a minimum length:
'42'.padStart(5, '0')    // '00042' — zero-pad numbers
'42'.padStart(5)         // '   42' — default pad is space
'hi'.padEnd(10, '.')     // 'hi........' — right-pad

// Real use: formatting IDs, time, table columns:
const formatTime = (h, m, s) =>
  [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
formatTime(9, 5, 3)   // '09:05:03'

// trim variants:
'  hello  '.trim()        // 'hello'
'  hello  '.trimStart()   // 'hello  ' — removes leading whitespace
'  hello  '.trimEnd()     // '  hello' — removes trailing whitespace

// repeat:
'ab'.repeat(3)   // 'ababab'
'='.repeat(40)   // '========================================'

// at() — negative indexing like Python (ES2022):
const s = 'Hello'
s.at(0)    // 'H'  — same as s[0]
s.at(-1)   // 'o'  — last character ✅
s.at(-2)   // 'l'  — second to last
// s[-1]    // undefined — bracket notation doesn't support negatives

// split:
'a,b,c'.split(',')     // ['a', 'b', 'c']
'hello'.split('')      // ['h','e','l','l','o']
'hello'.split('', 3)   // ['h','e','l'] — limit
''.split(',')          // [''] ← gotcha: one empty string element, not []

export {}`,
    feedback_correct: "✅ padStart for zero-padding. at(-1) for last char. trim/trimStart/trimEnd for whitespace. repeat for strings.",
    feedback_partial: "'42'.padStart(5,'0')='00042'. str.at(-1)=last char. '  x  '.trim()='x'.",
    feedback_wrong: "padStart(length, fillChar). at(-1) = last. trim() removes both ends.",
    expected: "padStart/padEnd/trim/at/repeat",
  },
  {
    id: "step4", type: "question", phase: "Step 4 of 5",
    paal: "Build a real-world string pipeline: a slugify function that converts 'Hello World!' → 'hello-world'.",
    answer_keywords: ["toLowerCase", "replace", "trim", "split", "join", "slug"],
    seed_code: `// Step 4: string method chaining — real-world pipeline

// Slugify: 'Hello, World! & More' → 'hello-world-and-more'
function slugify(title) {
  return title
    .toLowerCase()                        // 'hello, world! & more'
    .replace(/&/g, 'and')               // 'hello, world! and more'
    .replace(/[^\w\s-]/g, '')           // remove punctuation: 'hello world and more'
    .trim()                              // remove leading/trailing spaces
    .replace(/\s+/g, '-')              // spaces → hyphens: 'hello-world-and-more'
    .replace(/-+/g, '-')               // collapse multiple hyphens
}

slugify('Hello, World! & More')    // 'hello-world-and-more'
slugify('  My  Blog   Post!!  ')   // 'my-blog-post'

// Truncate with ellipsis:
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3).trimEnd() + '...'
}

truncate('Hello, World!', 8)   // 'Hello...'

// Highlight search term in text (for search UIs):
function highlight(text, term) {
  const regex = new RegExp(\`(\${term})\`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

highlight('The quick brown fox', 'quick')
// 'The <mark>quick</mark> brown fox'

export { slugify, truncate, highlight }`,
    feedback_correct: "✅ Chained string methods build clean text pipelines. Order matters — normalize first, transform next, clean last.",
    feedback_partial: "toLowerCase → normalize special chars → trim → collapse whitespace → replace spaces.",
    feedback_wrong: "str.toLowerCase().replace(/[^\\w\\s]/g,'').trim().replace(/\\s+/g,'-')",
    expected: "String method pipeline — slugify",
  },
  {
    id: "step5", type: "question", phase: "Step 5 of 5",
    paal: "Show String.fromCharCode, charCodeAt, and normalize — plus the difference between string length and character count for emoji/Unicode.",
    answer_keywords: ["charCodeAt", "normalize", "codePointAt", "unicode", "emoji", "length"],
    seed_code: `// Step 5: Unicode, charCodes, and string length gotchas

// charCodeAt / fromCharCode — UTF-16 code units:
'A'.charCodeAt(0)      // 65
String.fromCharCode(65) // 'A'

// codePointAt — handles full Unicode (surrogate pairs):
'😀'.codePointAt(0)   // 128512 — the actual emoji code point
'😀'.charCodeAt(0)    // 55357 — just the high surrogate (wrong!)

// String.fromCodePoint — the Unicode-aware version:
String.fromCodePoint(128512)   // '😀'

// LENGTH GOTCHA — emoji and many Unicode chars take 2 UTF-16 units:
'hello'.length    // 5 ✓
'😀'.length       // 2 ← NOT 1! Each emoji = 2 code units in JS strings
'😀😀'.length     // 4

// Counting real characters (grapheme clusters) with Intl.Segmenter (ES2022):
const segmenter = new Intl.Segmenter()
const chars = [...segmenter.segment('Hello 😀')]
chars.length   // 7 — correct! ('H','e','l','l','o',' ','😀')

// Spreading also splits on code points (not code units):
[...'😀'].length   // 1 ✓ (spread uses Symbol.iterator which handles code points)
[...'😀😀'].length // 2 ✓

// normalize — Unicode normalization (important for comparison):
'é'.normalize('NFC').length   // 1 — precomposed form
'é'.normalize('NFD').length   // 2 — e + combining accent

// Practical: normalize before comparison or search:
const sameChar = 'café'.normalize('NFC') === 'café'.normalize('NFC')

export {}`,
    feedback_correct: "✅ emoji.length=2 (UTF-16 units). Use [...str].length or Intl.Segmenter for real char count. normalize before compare.",
    feedback_partial: "'😀'.length = 2, not 1. [...'😀'].length = 1. codePointAt for real code points.",
    feedback_wrong: "String length counts UTF-16 code units. Emoji = 2 units. [...str] or Intl.Segmenter for character count.",
    expected: "Unicode length gotchas and normalization",
  },
];

const sideItems = [
  { label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" },
  { label: "Step 1 — slice/search", id: "step1" }, { label: "Step 2 — replace/match", id: "step2" },
  { label: "Step 3 — pad/trim/at", id: "step3" }, { label: "Step 4 — Pipeline", id: "step4" },
  { label: "Step 5 — Unicode", id: "step5" },
];

export default createINPACTEngine({ NODES, sideItems, problemNum: "JS-C01", title: "String Methods", shortName: "JS — STRINGS" });
