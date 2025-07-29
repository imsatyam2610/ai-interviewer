import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { debounce } from "lodash";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme?: string;
  height?: string;
  options?: any;
  onAnalyzeCode?: (code: string) => void; // 👈 NEW
}

export default function MonacoEditor({
  value,
  onChange,
  language,
  theme = "vs-dark",
  height = "400px",
  options = {},
  onAnalyzeCode,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);
  const [editCount, setEditCount] = useState(0);

  // 👇 Debounced analyzer (runs 2 seconds after user stops typing)
  const debouncedAnalyze = useRef(
    debounce((code: string) => {
      if (onAnalyzeCode) onAnalyzeCode(code);
    }, 2000)
  ).current;

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    editor.updateOptions({
      fontSize: 14,
      fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
      lineNumbers: "on",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: "on",
      ...options,
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {});
  };

  const handleEditorChange = (code: string | undefined) => {
    onChange(code);
    if (code) {
      setEditCount((prev) => prev + 1);

      // 👇 Call AI analyzer after enough edits or debounce delay
      if (editCount >= 5) {
        debouncedAnalyze(code);
        setEditCount(0); // Reset counter
      } else {
        debouncedAnalyze(code); // Run after delay too
      }
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          automaticLayout: true,
          ...options,
        }}
      />
    </div>
  );
}
