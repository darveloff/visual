export type FigmaNode = {
  id: string;
  name: string;
  type: "FRAME" | "TEXT" | "GROUP" | "RECTANGLE" | "COMPONENT";
  text?: string;
  children?: FigmaNode[];
};

export type NormalizedNode = {
  id: string;
  name: string;
  kind: "section" | "heading" | "text" | "container";
  text?: string;
};

export type NormalizedTree = {
  title: string;
  nodes: NormalizedNode[];
};

function toKind(node: FigmaNode): NormalizedNode["kind"] {
  if (node.type === "TEXT" && node.name.toLowerCase().includes("heading")) {
    return "heading";
  }
  if (node.type === "TEXT") {
    return "text";
  }
  if (node.type === "FRAME" || node.type === "COMPONENT") {
    return "section";
  }
  return "container";
}

export function normalizeTree(root: FigmaNode): NormalizedTree {
  const flattened: NormalizedNode[] = [];

  const walk = (node: FigmaNode) => {
    flattened.push({
      id: node.id,
      name: node.name,
      kind: toKind(node),
      text: node.text,
    });
    for (const child of node.children ?? []) {
      walk(child);
    }
  };

  walk(root);
  return {
    title: root.name,
    nodes: flattened,
  };
}
