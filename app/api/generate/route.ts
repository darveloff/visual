import { NextResponse } from "next/server";

import { generateFromFigma } from "@/lib/pipeline/generateFromFigma";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    // #region agent log
    fetch("http://127.0.0.1:7866/ingest/a5a749f6-8947-4696-bc19-494f4d317254", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "5200d9" },
      body: JSON.stringify({
        sessionId: "5200d9",
        runId: "env-missing-debug",
        hypothesisId: "H1-H3",
        location: "app/api/generate/route.ts:POST:entry",
        message: "Generate request received",
        data: {
          host: request.headers.get("host"),
          hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
          hasSupabaseAnonKey: Boolean(process.env.SUPABASE_ANON_KEY),
          isVercel: Boolean(process.env.VERCEL),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    const body = (await request.json()) as { url?: string; nodeId?: string };
    if (!body.url) {
      return NextResponse.json({ error: "Missing `url` field." }, { status: 400 });
    }

    const result = await generateFromFigma({
      url: body.url,
      nodeId: body.nodeId,
    });

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("generation_runs").insert({
      source_url: result.input.url,
      node_id: result.input.nodeId ?? null,
      output_json: result,
      status: "success",
    });

    if (error) {
      return NextResponse.json(
        { error: `Generated, but failed to persist run: ${error.message}`, result },
        { status: 207 },
      );
    }

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
