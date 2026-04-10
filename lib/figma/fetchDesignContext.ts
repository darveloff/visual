import type { ParsedFigmaUrl } from "@/lib/figma/parseUrl";
import type { FigmaNode } from "@/lib/figma/normalizeTree";

type FetchInput = ParsedFigmaUrl & { nodeId?: string };

function titleFromRawUrl(rawUrl: string): string {
  const pathname = new URL(rawUrl).pathname.split("/").filter(Boolean);
  return pathname[pathname.length - 1]?.replaceAll("-", " ") || "Imported design";
}

// NOTE: In-app runtime cannot call Cursor MCP tools directly.
// This deterministic mock keeps the pipeline functional for MVP iteration.
export async function fetchDesignContext(input: FetchInput): Promise<FigmaNode> {
  const title = titleFromRawUrl(input.rawUrl);
  const nodeBase = input.nodeId ?? "0:1";

  return {
    id: nodeBase,
    name: title,
    type: "FRAME",
    children: [
      {
        id: `${nodeBase}:hero`,
        name: "Hero Section",
        type: "FRAME",
        children: [
          {
            id: `${nodeBase}:hero:heading`,
            name: "Heading",
            type: "TEXT",
            text: "Turn Figma concepts into production sections.",
          },
          {
            id: `${nodeBase}:hero:text`,
            name: "Body",
            type: "TEXT",
            text: "Generate deterministic Next.js components from your design node.",
          },
        ],
      },
      {
        id: `${nodeBase}:features`,
        name: "Features Grid",
        type: "FRAME",
        children: [
          {
            id: `${nodeBase}:features:title`,
            name: "Heading",
            type: "TEXT",
            text: "Designed for fast product iteration",
          },
          {
            id: `${nodeBase}:features:copy`,
            name: "Body",
            type: "TEXT",
            text: "Structure extraction, token mapping, and preview deploy in one flow.",
          },
        ],
      },
      {
        id: `${nodeBase}:cta`,
        name: "CTA Section",
        type: "FRAME",
        children: [
          {
            id: `${nodeBase}:cta:heading`,
            name: "Heading",
            type: "TEXT",
            text: "Ship UI faster",
          },
        ],
      },
    ],
  };
}
