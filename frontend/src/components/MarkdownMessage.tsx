"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

interface MarkdownMessageProps {
  content: string;
}

/**
 * Repairs malformed markdown code fences produced by streaming LLMs.
 *
 * The backend sometimes emits fences without newlines, e.g.:
 *   ```javapublic record Person(...) { }```
 *
 * Patterns fixed:
 *   1. Opening fence jammed into code:  ```java<code>  →  ```java\n<code>
 *   2. Closing fence jammed into code:  <code>```      →  <code>\n```
 */
function normalizeMarkdown(text: string): string {
  return text
    .replace(/(```[a-zA-Z]+)([^\n`])/g, "$1\n$2")
    .replace(/([^\n`])(```)/g, "$1\n$2");
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          const isInline = !match && !codeString.includes("\n");

          if (isInline) {
            return (
              <code
                className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-rose-600"
                {...props}
              >
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              language={match ? match[1] : "text"}
              code={codeString}
            />
          );
        },

        pre({ children }) {
          return <>{children}</>;
        },

        p({ children }) {
          return <p className="mb-4 last:mb-0 leading-7">{children}</p>;
        },

        h1({ children }) {
          return <h1 className="mb-4 mt-6 text-2xl font-bold">{children}</h1>;
        },

        h2({ children }) {
          return <h2 className="mb-3 mt-5 text-xl font-bold">{children}</h2>;
        },

        h3({ children }) {
          return <h3 className="mb-2 mt-4 text-lg font-semibold">{children}</h3>;
        },

        ul({ children }) {
          return <ul className="mb-4 ml-6 list-disc space-y-1">{children}</ul>;
        },

        ol({ children }) {
          return <ol className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>;
        },

        li({ children }) {
          return <li className="leading-7">{children}</li>;
        },

        blockquote({ children }) {
          return (
            <blockquote className="mb-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic">
              {children}
            </blockquote>
          );
        },

        a({ href, children }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              {children}
            </a>
          );
        },

        table({ children }) {
          return (
            <div className="mb-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          );
        },

        th({ children }) {
          return (
            <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold">
              {children}
            </th>
          );
        },

        td({ children }) {
          return (
            <td className="border border-gray-300 px-4 py-2">{children}</td>
          );
        },
      }}
    >
      {normalizeMarkdown(content)}
    </ReactMarkdown>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group relative mb-4 overflow-hidden rounded-xl border border-gray-200 bg-[#282c34]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py1 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "transparent",
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={code.split("\n").length > 5}
        lineNumberStyle={{
          color: "#4b5563",
          fontSize: "0.75rem",
          paddingRight: "1rem",
          minWidth: "2.5rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
