import { useState } from "react";
import { ChatRequest } from "@/types/chat";

const API =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

export function useChatStream() {
  const [response, setResponse] =
    useState("");

  const stream = async (body: ChatRequest) => {
    setResponse("");

    const res = await fetch(
      `${API}/api/chat/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const reader =
      res.body?.getReader();

    if (!reader) return;

    const decoder =
      new TextDecoder();

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      const lines = chunk
        .split("\n")
        .filter((line) =>
          line.startsWith("data:")
        );

      for (const line of lines) {
        setResponse(
          (prev) =>
            prev +
            line.replace(
              "data:",
              ""
            )
        );
      }
    }
  };

  return {
    response,
    stream,
  };
}