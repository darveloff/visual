import { NextResponse } from "next/server";

import { getSupabaseClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("generation_runs")
      .select("id, source_url, node_id, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ runs: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch history.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
