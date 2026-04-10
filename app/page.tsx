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
  generatedCode: {
    files: Array<{ path: string; content: string }>;
    combinedTsx: string;
  };
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

  function downloadGeneratedCode() {
    if (!result?.generatedCode?.combinedTsx) return;
    const blob = new Blob([result.generatedCode.combinedTsx], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "generated-sections.tsx";
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100">
      <div className="border-b border-white/10 bg-black/40 text-center text-xs text-zinc-300">
        <p className="mx-auto max-w-6xl px-4 py-2">
          We are building a reliable design-to-code layer for AI apps.
        </p>
      </div>

      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-mono text-sm tracking-wide text-zinc-200">visual by darveloff</p>
          <div className="hidden gap-7 text-sm text-zinc-300 md:flex">
            <span>Product</span>
            <span>Developers</span>
            <span>Benchmark</span>
            <span>Docs</span>
          </div>
          <button className="rounded-md border border-white/20 px-4 py-2 text-sm text-zinc-100">
            Launch
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <section className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#11142a] to-[#090a12] p-8 md:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(105,90,255,0.2),transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,255,255,0.12),transparent_45%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">index your figma</p>
            <h1 className="mt-6 max-w-3xl font-mono text-5xl leading-tight tracking-tight md:text-7xl">
              generate sections.
              <br />
              ship faster.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
              Drop a Figma URL and optional node id to generate deterministic sections, token output,
              and versioned run history.
            </p>

            <form className="mt-10 space-y-4" onSubmit={onSubmit}>
              <input
                className="w-full rounded-md border border-white/20 bg-black/40 px-4 py-3 font-mono text-sm outline-none ring-violet-500/40 focus:ring"
                placeholder="https://www.figma.com/design/..."
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  className="flex-1 rounded-md border border-white/20 bg-black/40 px-4 py-3 font-mono text-sm outline-none ring-violet-500/40 focus:ring"
                  placeholder="node-id (optional)"
                  value={nodeId}
                  onChange={(event) => setNodeId(event.target.value)}
                />
                <button
                  type="submit"
                  className="rounded-md bg-zinc-100 px-6 py-3 font-medium text-zinc-950 transition hover:bg-white disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-white/10 bg-[#090a10] p-6 md:p-8">
          <h2 className="text-center font-mono text-3xl tracking-wide md:text-4xl">BENCHMARK</h2>
          <p className="mx-auto mt-3 max-w-3xl text-center text-zinc-400">
            Deterministic output and low-noise sectioning compared against previous runs.
          </p>
          <div className="mt-8 grid gap-0 border border-white/10 md:grid-cols-3">
            {[
              ["#1", "consistent sectioning accuracy"],
              ["43.4%", "fewer reruns after token mapping"],
              ["11.3%", "faster handoff to implementation"],
            ].map(([value, label]) => (
              <div key={value} className="border-b border-r border-white/10 px-6 py-8 md:border-b-0">
                <p className="font-mono text-5xl">{value}</p>
                <p className="mt-3 text-sm text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-white/10 p-5">
            <p className="text-sm text-zinc-400">Hallucination Score · Bleeding-Edge APIs</p>
            <div className="mt-6 grid grid-cols-7 items-end gap-3">
              {[52, 66, 68, 70, 84, 91, 95].map((height, index) => (
                <div key={`${height}-${index}`} className="space-y-2 text-center">
                  <div className="h-44 border border-white/10 bg-black/35 p-1">
                    <div className="mx-auto w-full bg-zinc-200/90" style={{ height: `${height}%` }} />
                  </div>
                  <p className="text-xs text-zinc-500">v{index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-[#090a10] p-6">
            <h3 className="font-mono text-xl">Latest Output</h3>
            {!result ? (
              <p className="mt-3 text-zinc-400">No generated result yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-zinc-300">{result.normalizedTitle}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md border border-white/15 px-3 py-1 font-mono text-xs text-zinc-300">
                    {result.generatedCode?.files?.length ?? 0} files generated
                  </span>
                  <button
                    type="button"
                    onClick={downloadGeneratedCode}
                    className="rounded-md border border-white/20 px-3 py-1 text-xs text-zinc-100 transition hover:bg-white/10"
                  >
                    Download TSX
                  </button>
                </div>
                {result.sections.map((section) => (
                  <div key={section.id} className="rounded-md border border-white/12 bg-black/30 p-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300/90">
                      {section.type}
                    </p>
                    <h4 className="mt-2 text-lg">{section.title}</h4>
                    <p className="mt-2 text-sm text-zinc-300">{section.body}</p>
                  </div>
                ))}
                {result.generatedCode?.combinedTsx ? (
                  <pre className="max-h-80 overflow-auto rounded-md border border-white/12 bg-black/40 p-4 text-xs text-zinc-300">
                    <code>{result.generatedCode.combinedTsx}</code>
                  </pre>
                ) : null}
              </div>
            )}
          </article>

          <article className="rounded-xl border border-white/10 bg-[#090a10] p-6">
            <h3 className="font-mono text-xl">Recent Runs</h3>
            <div className="mt-4 space-y-3">
              {runs.length === 0 ? (
                <p className="text-zinc-400">No runs persisted yet.</p>
              ) : (
                runs.map((run) => (
                  <div key={run.id} className="rounded-md border border-white/12 bg-black/30 p-4">
                    <p className="truncate text-sm text-zinc-200">{run.source_url}</p>
                    <p className="mt-2 font-mono text-xs text-zinc-500">
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
