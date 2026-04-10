import { NextResponse } from "next/server";

import { generateFromFigma } from "@/lib/pipeline/generateFromFigma";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
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
