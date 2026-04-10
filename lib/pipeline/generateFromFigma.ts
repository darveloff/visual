import { fetchDesignContext } from "@/lib/figma/fetchDesignContext";
import { normalizeTree } from "@/lib/figma/normalizeTree";
import { parseFigmaUrl } from "@/lib/figma/parseUrl";
import { generateSections } from "@/lib/generator/sectionGenerator";
import { mapTokens } from "@/lib/generator/tokenMapper";

export type GenerationResult = {
  input: {
    url: string;
    fileKey: string;
    nodeId?: string;
  };
  normalizedTitle: string;
  sections: ReturnType<typeof generateSections>;
  tokens: ReturnType<typeof mapTokens>;
  warnings: string[];
};

export async function generateFromFigma(input: { url: string; nodeId?: string }) {
  const parsed = parseFigmaUrl(input.url);
  const context = await fetchDesignContext({
    ...parsed,
    nodeId: input.nodeId ?? parsed.nodeId,
  });
  const normalized = normalizeTree(context);
  const sections = generateSections(normalized);
  const tokens = mapTokens();

  const result: GenerationResult = {
    input: {
      url: input.url,
      fileKey: parsed.fileKey,
      nodeId: input.nodeId ?? parsed.nodeId,
    },
    normalizedTitle: normalized.title,
    sections,
    tokens,
    warnings: [
      "Design-context fetch currently uses deterministic mock data. Swap fetchDesignContext with MCP-backed fetch when server-side adapter is added.",
    ],
  };

  return result;
}
