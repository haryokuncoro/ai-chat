"use client";

import { useEffect, useState } from "react";
import { chat, createSession } from "@/lib/api";

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

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  async function handleSend() {
    if (!prompt.trim()) return;

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
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Chat
      </h1>

      <div className="mb-4 min-h-[400px] rounded border p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="mb-4"
          >
            <strong>
              {message.role}
            </strong>

            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <textarea
        className="w-full rounded border p-3"
        rows={4}
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Thinking..."
          : "Send"}
      </button>
    </main>
  );
}