import { useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

const TAB_LABELS = { html: "HTML", css: "CSS" };
const basicSetup = {
  lineNumbers: true,
  highlightActiveLineGutter: true,
  history: true,
  indentOnInput: true,
  bracketMatching: true,
  tabSize: 2,
};

/**
 * Two-tab editor for CSS engines: HTML and CSS.
 * value: { html: string, css: string }
 * onChange: (value: { html, css }) => void
 */
export default function CssTabsEditor({ value = {}, onChange, height = "240px" }) {
  const [activeTab, setActiveTab] = useState("html");
  const html = value.html ?? "";
  const css = value.css ?? "";

  const currentValue = activeTab === "html" ? html : css;

  const handleChange = (newVal) => {
    if (activeTab === "html") onChange({ ...value, html: newVal });
    else onChange({ ...value, css: newVal });
  };

  const extensions = useMemo(() => [javascript()], []);

  return (
    <div style={styles.wrap}>
      <div style={styles.tabBar}>
        {["html", "css"].map((key) => (
          <button
            key={key}
            type="button"
            style={{ ...styles.tab, ...(activeTab === key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(key)}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </div>
      <div style={styles.editor}>
        <CodeMirror
          value={currentValue}
          height={height}
          theme={oneDark}
          extensions={extensions}
          onChange={handleChange}
          basicSetup={basicSetup}
          style={styles.cm}
        />
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    borderRadius: "8px",
    border: "1px solid #1e2733",
    overflow: "hidden",
    background: "#1a1d2e",
    marginBottom: "16px",
  },
  tabBar: {
    display: "flex",
    gap: "2px",
    padding: "6px 8px 0",
    background: "#13151f",
    borderBottom: "1px solid #2d3748",
  },
  tab: {
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    background: "transparent",
    border: "none",
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
    color: "#64748b",
    cursor: "pointer",
  },
  tabActive: {
    color: "#c4b5fd",
    background: "#1a1d2e",
  },
  editor: { minHeight: 0 },
  cm: { fontSize: "15px" },
};
