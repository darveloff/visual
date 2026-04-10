"use client";

import { FormEvent, useEffect, useState } from "react";

type HistoryRun = {
  id: number;
  source_url: string;
  node_id: string | null;
  status: string;
  created_at: string;
};

type GenerationResult = {
  normalizedTitle: string;
  sections: Array<{ id: string; type: string; title: string; body: string }>;
  tokens: Record<string, unknown>;
  warnings: string[];
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [runs, setRuns] = useState<HistoryRun[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadHistory() {
    const response = await fetch("/api/history");
    const data = (await response.json()) as { runs?: HistoryRun[]; error?: string };
    if (data.runs) {
      setRuns(data.runs);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, nodeId: nodeId || undefined }),
      });
      const data = (await response.json()) as {
        error?: string;
        result?: GenerationResult;
      };

      if (!response.ok && !data.result) {
        throw new Error(data.error ?? "Generation failed.");
      }
      if (data.error) {
        setError(data.error);
      }
      if (data.result) {
        setResult(data.result);
      }
      await loadHistory();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unknown error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="rounded-3xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl shadow-cyan-500/10">
          <h1 className="text-4xl font-semibold tracking-tight">Figma-to-Production Mini Builder</h1>
          <p className="mt-3 text-zinc-300">
            Submit a Figma URL and generate deterministic section output with token mapping.
          </p>
          <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
            <input
              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 outline-none ring-cyan-500/50 focus:ring"
              placeholder="https://www.figma.com/design/..."
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-3 outline-none ring-cyan-500/50 focus:ring"
              placeholder="Optional node id (e.g. 1:2)"
              value={nodeId}
              onChange={(event) => setNodeId(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 font-medium text-zinc-950 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </form>
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-medium">Latest Result</h2>
            {!result ? (
              <p className="mt-3 text-zinc-400">No generated result yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-zinc-300">{result.normalizedTitle}</p>
                {result.sections.map((section) => (
                  <div key={section.id} className="rounded-xl border border-white/10 p-4">
                    <p className="text-xs uppercase tracking-widest text-cyan-300">{section.type}</p>
                    <h3 className="mt-1 font-medium">{section.title}</h3>
                    <p className="mt-2 text-sm text-zinc-300">{section.body}</p>
                  </div>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
            <h2 className="text-xl font-medium">Recent Runs</h2>
            <div className="mt-4 space-y-3">
              {runs.length === 0 ? (
                <p className="text-zinc-400">No runs persisted yet.</p>
              ) : (
                runs.map((run) => (
                  <div key={run.id} className="rounded-xl border border-white/10 p-3">
                    <p className="truncate text-sm text-zinc-200">{run.source_url}</p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {run.status} - {new Date(run.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
