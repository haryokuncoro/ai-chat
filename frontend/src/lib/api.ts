import { ChatRequest, CodeReviewRequest } from "@/types/chat";


const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function createSession() {
  const res = await fetch(
    `${BASE_URL}/api/chat/sessions`,
    {
      method: "POST",
    }
  );

  return await res.text();
}

export async function chat(
  request: ChatRequest
) {
  const res = await fetch(
    `${BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  return await res.text();
}

export async function review(
  request: CodeReviewRequest
) {
  const res = await fetch(
    `${BASE_URL}/api/review`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  return await res.json();
}