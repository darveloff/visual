export type ParsedFigmaUrl = {
  fileKey: string;
  nodeId?: string;
  kind: "design" | "board" | "make";
  rawUrl: string;
};

function normalizeNodeId(nodeId?: string | null): string | undefined {
  if (!nodeId) return undefined;
  return nodeId.replaceAll("-", ":");
}

export function parseFigmaUrl(input: string): ParsedFigmaUrl {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid URL format.");
  }

  if (!url.hostname.includes("figma.com")) {
    throw new Error("URL must be a figma.com link.");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const nodeId = normalizeNodeId(url.searchParams.get("node-id"));

  if (parts[0] === "design" && parts[1]) {
    if (parts[2] === "branch" && parts[3]) {
      return { fileKey: parts[3], nodeId, kind: "design", rawUrl: input };
    }
    return { fileKey: parts[1], nodeId, kind: "design", rawUrl: input };
  }

  if (parts[0] === "board" && parts[1]) {
    return { fileKey: parts[1], nodeId, kind: "board", rawUrl: input };
  }

  if (parts[0] === "make" && parts[1]) {
    return { fileKey: parts[1], nodeId, kind: "make", rawUrl: input };
  }

  throw new Error("Unsupported Figma URL pattern.");
}
