import { NextResponse } from "next/server";

import { parseFigmaUrl } from "@/lib/figma/parseUrl";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string; nodeId?: string };
    if (!body.url) {
      return NextResponse.json({ error: "Missing `url` field." }, { status: 400 });
    }

    const parsed = parseFigmaUrl(body.url);
    return NextResponse.json({
      ok: true,
      parsed: {
        ...parsed,
        nodeId: body.nodeId ?? parsed.nodeId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to parse URL.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
