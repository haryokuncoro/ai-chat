import { ChatRequest } from "@/types/chat";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function createSession(): Promise<string> {
  const response = await fetch(
    `${API}/api/chat/sessions`,
    {
      method: "POST",
    }
  );

  return response.text();
}

export async function chat(
  request: ChatRequest
): Promise<string> {
  const response = await fetch(
    `${API}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  return response.text();
}