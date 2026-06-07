import FeatureCard
from "@/components/FeatureCard";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="text-4xl font-bold">
          AI Assistant
        </h1>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="Chat"
            description="Standard chat"
            href="/chat"
          />

          <FeatureCard
            title="Stream Chat"
            description="Streaming chat"
            href="/stream"
          />

          <FeatureCard
            title="Code Review"
            description="AI code review"
            href="/review"
          />
        </div>
      </div>
    </main>
  );
}