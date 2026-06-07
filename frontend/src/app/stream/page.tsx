"use client";

import { useEffect, useRef, useState } from "react";
import { createSession } from "@/lib/api";
import { useChatStream } from "@/hooks/useChatStream";
import { MarkdownMessage } from "@/components/MarkdownMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function StreamPage() {
  const [sessionId, setSessionId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { response, stream } = useChatStream();

  // Keep a ref so we can reliably read the final value after streaming ends
  const responseRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  // Keep ref in sync with streaming state
  useEffect(() => {
    responseRef.current = response;
  }, [response]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, response]);

  async function handleSend() {
    if (!prompt.trim() || loading) return;

    const userPrompt = prompt;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userPrompt },
    ]);

    setPrompt("");
    setLoading(true);

    try {
      await stream({
        sessionId,
        provider: "OPENAI",
        model: "gpt-4.1-mini",
        mode: "CHAT",
        prompt: userPrompt,
      });

      // Read from ref — guaranteed to have the final accumulated value
      const finalContent = responseRef.current;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: finalContent },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Streaming Chat</h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 && !response && (
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-semibold">
                What shall we stream today?
              </h2>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-8 flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" ? (
                // ✅ Fixed: use MarkdownMessage so completed messages get highlighting
                <div className="max-w-full text-gray-900">
                  <MarkdownMessage content={message.content} />
                </div>
              ) : (
                <div className="max-w-[80%] rounded-3xl bg-gray-100 px-5 py-3 whitespace-pre-wrap">
                  {message.content}
                </div>
              )}
            </div>
          ))}

          {/* Live streaming response */}
          {loading && (
            <div className="mb-8">
              <div className="max-w-full text-gray-900">
                <MarkdownMessage content={response} />
                <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-black" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border bg-white shadow-sm">
            <textarea
              rows={3}
              value={prompt}
              placeholder="Message AI..."
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full resize-none rounded-3xl border-0 p-4 outline-none"
            />

            <div className="flex justify-end p-3">
              <button
                onClick={handleSend}
                disabled={loading || !prompt.trim()}
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-gray-500">
            Responses are streamed token by token. Because apparently humans
            enjoy watching text slowly appear instead of waiting 2 seconds.
          </p>
        </div>
      </div>
    </main>
  );
}