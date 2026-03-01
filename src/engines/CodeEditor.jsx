import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorSelection } from '@codemirror/state'
import { useCallback, useRef, useEffect } from 'react'

export default function CodeEditor({ value, onChange, height = "320px", cursorAtEndOfLine }) {
  const viewRef = useRef(null)
  const handleChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  useEffect(() => {
    if (cursorAtEndOfLine == null || !viewRef.current) return
    const view = viewRef.current
    const raf = requestAnimationFrame(() => {
      if (!viewRef.current) return
      const doc = viewRef.current.state.doc
      const lineNum = Math.min(cursorAtEndOfLine, doc.lines)
      const line = doc.line(lineNum)
      viewRef.current.dispatch({ selection: EditorSelection.cursor(line.to) })
      viewRef.current.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [value, cursorAtEndOfLine])

  const onCreateEditor = useCallback((view) => {
    viewRef.current = view
    if (cursorAtEndOfLine != null && view) {
      const doc = view.state.doc
      const lineNum = Math.min(cursorAtEndOfLine, doc.lines)
      const line = doc.line(lineNum)
      view.dispatch({ selection: EditorSelection.cursor(line.to) })
      view.focus()
    }
  }, [cursorAtEndOfLine])

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
