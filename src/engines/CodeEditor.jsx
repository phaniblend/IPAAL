import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useCallback } from 'react'

export default function CodeEditor({ value, onChange, height = "320px" }) {
  const handleChange = useCallback((val) => {
    onChange(val)
  }, [onChange])

  return (
    <CodeMirror
      value={value}
      height={height}
      theme={oneDark}
      extensions={[javascript({ jsx: true })]}
      onChange={handleChange}
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
