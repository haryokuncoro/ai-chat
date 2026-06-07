import { useState } from "react";
import { ChatRequest } from "@/types/chat";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

export function useChatStream() {
  const [response, setResponse] = useState("");

  const stream = async (body: ChatRequest) => {
    setResponse("");

    const res = await fetch(`${API}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          const token = parseSSELine(buffer);
          if (token !== null) setResponse((prev) => prev + token);
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const token = parseSSELine(line);
        if (token !== null) setResponse((prev) => prev + token);
      }
    }
  };

  return { response, stream };
}

function parseSSELine(line: string): string | null {
  // Only process SSE data lines
  if (!line.startsWith("data:")) return null;

  // Slice off "data:" only — preserve the space the backend sends after it
  const token = line.slice("data:".length);

  // Ignore SSE control messages
  if (token.trim() === "[DONE]" || token.trim() === "") return null;

  return token;
}