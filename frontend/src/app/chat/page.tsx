"use client";

import { useEffect, useRef, useState } from "react";
import { chat, createSession } from "@/lib/api";
import { MarkdownMessage }
from "@/components/MarkdownMessage";


interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [sessionId, setSessionId] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleSend() {
    if (!prompt.trim() || loading)
      return;

    const userPrompt = prompt;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    setPrompt("");
    setLoading(true);

    try {
      const response = await chat({
        sessionId,
        provider: "OPENAI",
        model: "gpt-4.1-mini",
        mode: "CHAT",
        prompt: userPrompt,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">
          AI Chat
        </h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {messages.length === 0 && (
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-semibold">
                How can I help you today?
              </h2>
            </div>
          )}

          {messages.map(
            (message, index) => (
              <div
                key={index}
                className={`mb-8 flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role ===
                "assistant" ? (
                  <div className="max-w-full whitespace-pre-wrap text-gray-900">
                    <MarkdownMessage
                      content={message.content}
                    />
                  </div>
                ) : (
                  <div className="max-w-[80%] rounded-3xl bg-gray-100 px-5 py-3 whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
              </div>
            )
          )}

          {loading && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
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
              onChange={(e) =>
                setPrompt(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message AI..."
              className="w-full resize-none rounded-3xl border-0 p-4 outline-none focus:ring-0"
            />

            <div className="flex justify-end p-3">
              <button
                onClick={handleSend}
                disabled={
                  loading ||
                  !prompt.trim()
                }
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-gray-500">
            AI can make mistakes. Humans
            invented JavaScript, so anything
            is possible.
          </p>
        </div>
      </div>
    </main>
  );
}