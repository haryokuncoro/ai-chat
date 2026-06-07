"use client";

import { useState } from "react";
import { review } from "@/lib/api";
import {
  CodeReviewResponse,
} from "@/types/chat";

export default function ReviewPage() {
  const [title, setTitle] =
    useState("");

  const [code, setCode] =
    useState("");

  const [result, setResult] =
    useState<CodeReviewResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  async function handleReview() {
    setLoading(true);

    try {
      const response =
        await review({
          sessionId:
            crypto.randomUUID(),
          provider: "OPENAI",
          title,
          code,
        });

      setResult(response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Code Review
      </h1>

      <input
        className="mb-4 w-full rounded border p-3"
        placeholder="Review title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        rows={20}
        className="w-full rounded border p-3 font-mono"
        placeholder="Paste code here..."
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
      />

      <button
        onClick={handleReview}
        disabled={loading}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        {loading
          ? "Reviewing..."
          : "Review"}
      </button>

      {result && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            Summary
          </h2>

          <p>{result.summary}</p>

          <h2 className="mt-8 mb-4 text-2xl font-bold">
            Findings
          </h2>

          {result.findings.map(
            (finding, index) => (
              <div
                key={index}
                className="mb-4 rounded border p-4"
              >
                <div className="font-bold">
                  {finding.severity}
                </div>

                <div>
                  {finding.message}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}