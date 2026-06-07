"use client";

import { useEffect, useState } from "react";
import { createSession } from "@/lib/api";
import { useChatStream } from "@/hooks/useChatStream";

export default function StreamPage() {
  const [sessionId, setSessionId] =
    useState("");

  const [prompt, setPrompt] =
    useState("");

  const { response, stream } =
    useChatStream();

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  async function handleSend() {
    await stream({
      sessionId,
      provider: "OPENAI",
      model: "gpt-4.1-mini",
      mode: "CHAT",
      prompt,
    });
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Stream Chat
      </h1>

      <textarea
        rows={4}
        className="w-full rounded border p-3"
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />

      <button
        onClick={handleSend}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Send
      </button>

      <div className="mt-6 rounded border p-4">
        <pre>{response}</pre>
      </div>
    </main>
  );
}