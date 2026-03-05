import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorSelection } from '@codemirror/state'
import { useCallback, useRef, useEffect } from 'react'

export default function CodeEditor({ value, onChange, height = "320px", cursorAtEndOfLine, cursorAtStartOfLine }) {
  const viewRef = useRef(null)
  const handleChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  const placeCursor = useCallback((view) => {
    if (!view) return
    const doc = view.state.doc
    const lineNum = cursorAtStartOfLine != null
      ? Math.min(cursorAtStartOfLine, doc.lines)
      : cursorAtEndOfLine != null
        ? Math.min(cursorAtEndOfLine, doc.lines)
        : null
    if (lineNum == null) return
    const line = doc.line(lineNum)
    const pos = cursorAtStartOfLine != null ? line.from : line.to
    view.dispatch({ selection: EditorSelection.cursor(pos) })
    view.focus()
  }, [cursorAtEndOfLine, cursorAtStartOfLine])

  useEffect(() => {
    if ((cursorAtEndOfLine == null && cursorAtStartOfLine == null) || !viewRef.current) return
    const raf = requestAnimationFrame(() => {
      if (viewRef.current) placeCursor(viewRef.current)
    })
    return () => cancelAnimationFrame(raf)
  }, [cursorAtEndOfLine, cursorAtStartOfLine, placeCursor])

  const onCreateEditor = useCallback((view) => {
    viewRef.current = view
    if ((cursorAtEndOfLine != null || cursorAtStartOfLine != null) && view) placeCursor(view)
  }, [cursorAtEndOfLine, cursorAtStartOfLine, placeCursor])

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={oneDark}
      extensions={[javascript({ jsx: true })]}
      onChange={handleChange}
      onCreateEditor={onCreateEditor}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        highlightSpecialChars: true,
        history: true,
        foldGutter: true,
        drawSelection: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        syntaxHighlighting: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        rectangularSelection: true,
        crosshairCursor: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        closeBracketsKeymap: true,
        defaultKeymap: true,
        searchKeymap: true,
        historyKeymap: true,
        foldKeymap: true,
        completionKeymap: true,
        lintKeymap: true,
        tabSize: 2,
      }}
      style={{
        fontSize: '15px',
        borderRadius: '8px',
        border: '1px solid #1e2733',
        overflow: 'hidden',
      }}
    />
  )
}
