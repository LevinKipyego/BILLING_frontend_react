import Editor from "@monaco-editor/react";

import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

import { setupMonaco } from "./setup";

interface CodeEditorProps {
  value: string;
  language: string;
  title?: string;

  copied?: boolean;
  onCopy?: () => void;

  onDownload?: () => void;
  onFullscreen?: () => void;

  height?: number | string;
}

export default function CodeEditor({
  value,
  language,
  title = "Code",

  copied = false,
  onCopy,

  onDownload,
  onFullscreen,

  height = 320,
}: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <span className="ml-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              title="Download"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          )}

          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              title="Fullscreen"
            >
              <ArrowsPointingOutIcon className="h-4 w-4" />
            </button>
          )}

          {onCopy && (
            <button
              onClick={onCopy}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <Editor
        beforeMount={setupMonaco}
        theme="vs-dark"
        language={language}
        value={value}
        height={height}
        options={{
          readOnly: true,

          automaticLayout: true,

          minimap: {
            enabled: false,
          },

          wordWrap: "on",

          scrollBeyondLastLine: false,

          lineNumbers: "on",

          fontSize: 13,

          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",

          fontLigatures: true,

          padding: {
            top: 12,
            bottom: 12,
          },

          folding: true,

          bracketPairColorization: {
            enabled: true,
          },

          guides: {
            indentation: true,
            bracketPairs: true,
          },

          renderWhitespace: "selection",

          smoothScrolling: true,

          cursorBlinking: "smooth",

          roundedSelection: true,

          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}