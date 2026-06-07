"use client";

import { useEffect, useState } from "react";
import { createSession, review } from "@/lib/api";
import { CodeReviewResponse } from "@/types/chat";

export default function ReviewPage() {
  const [sessionId, setSessionId] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [code, setCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<CodeReviewResponse | null>(
      null
    );

  useEffect(() => {
    createSession().then(setSessionId);
  }, []);

  async function handleReview() {
    if (
      !sessionId ||
      !title.trim() ||
      !code.trim() ||
      loading
    ) {
      return;
    }

    setLoading(true);

    try {
      const response =
        await review({
          sessionId,
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Code Review
          </h1>

          <p className="mt-2 text-gray-600">
            Submit code and receive an AI
            review. Because production
            debugging at 2 AM is a hobby
            nobody asked for.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <input
            type="text"
            placeholder="Review title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

          <textarea
            rows={20}
            placeholder="Paste code here..."
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            className="w-full rounded-lg border p-3 font-mono text-sm"
          />

          <div className="flex justify-end">
            <button
              onClick={handleReview}
              disabled={
                loading ||
                !sessionId ||
                !title.trim() ||
                !code.trim()
              }
              className="rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Reviewing..."
                : !sessionId
                ? "Creating Session..."
                : "Review Code"}
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-semibold">
                Summary
              </h2>

              <p className="whitespace-pre-wrap text-gray-700">
                {result.summary}
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">
                Findings
              </h2>

              <div className="space-y-4">
                {result.findings.map(
                  (
                    finding,
                    index
                  ) => (
                    <div
                      key={index}
                      className="rounded-xl border p-4"
                    >
                      <div className="mb-2 font-semibold">
                        {
                          finding.severity
                        }
                      </div>

                      <p className="text-gray-700">
                        {
                          finding.message
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}