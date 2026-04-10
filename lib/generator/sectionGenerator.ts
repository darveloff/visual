import type { NormalizedTree } from "@/lib/figma/normalizeTree";

export type GeneratedSection = {
  id: string;
  type: "Hero" | "FeatureGrid" | "CTA" | "GenericSection";
  title: string;
  body: string;
};

export function generateSections(tree: NormalizedTree): GeneratedSection[] {
  const sections = tree.nodes.filter((node) => node.kind === "section");
  if (sections.length === 0) {
    return [
      {
        id: "fallback-section",
        type: "GenericSection",
        title: tree.title,
        body: "No section nodes found. Use a top-level frame with grouped blocks.",
      },
    ];
  }

  return sections.map((section, index) => {
    const titleNode = tree.nodes.find(
      (node) => node.kind === "heading" && node.id.startsWith(section.id),
    );
    const bodyNode = tree.nodes.find(
      (node) => node.kind === "text" && node.id.startsWith(section.id) && node.id !== titleNode?.id,
    );

    const type: GeneratedSection["type"] =
      index === 0 ? "Hero" : index === sections.length - 1 ? "CTA" : "FeatureGrid";

    return {
      id: section.id,
      type,
      title: titleNode?.text ?? section.name,
      body: bodyNode?.text ?? "Generated section body.",
    };
  });
}
