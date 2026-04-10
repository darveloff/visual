import type { GeneratedSection } from "@/lib/generator/sectionGenerator";
import type { TokenMap } from "@/lib/generator/tokenMapper";

type GeneratedFile = {
  path: string;
  content: string;
};

function safeComponentName(section: GeneratedSection, index: number): string {
  const base = `${section.type}Section${index + 1}`.replace(/[^a-zA-Z0-9]/g, "");
  return /^[A-Z]/.test(base) ? base : `Section${base}`;
}

function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function sectionComponentContent(componentName: string, section: GeneratedSection): string {
  return `export function ${componentName}() {
  return (
    <section className="rounded-md border border-white/15 bg-black/30 p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300/90">${section.type}</p>
      <h2 className="mt-2 text-2xl font-medium">${escapeText(section.title)}</h2>
      <p className="mt-3 text-zinc-300">${escapeText(section.body)}</p>
    </section>
  );
}
`;
}

function indexPageContent(componentNames: string[], tokens: TokenMap): string {
  const imports = componentNames.map((name) => `import { ${name} } from "./sections/${name}";`).join("\n");
  const sections = componentNames.map((name) => `        <${name} />`).join("\n");
  return `${imports}

const tokens = ${JSON.stringify(tokens, null, 2)} as const;

export default function GeneratedLandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-14 text-zinc-100">
      <div className="mx-auto grid max-w-5xl gap-6">
${sections}
      </div>
    </main>
  );
}
`;
}

export type GeneratedCodeBundle = {
  files: GeneratedFile[];
  combinedTsx: string;
};

export function generateReactCodeBundle(
  sections: GeneratedSection[],
  tokens: TokenMap,
): GeneratedCodeBundle {
  const sectionFiles = sections.map((section, index) => {
    const componentName = safeComponentName(section, index);
    return {
      componentName,
      file: {
        path: `generated/sections/${componentName}.tsx`,
        content: sectionComponentContent(componentName, section),
      },
    };
  });

  const entryFile: GeneratedFile = {
    path: "generated/page.tsx",
    content: indexPageContent(
      sectionFiles.map((item) => item.componentName),
      tokens,
    ),
  };

  const files = [entryFile, ...sectionFiles.map((item) => item.file)];
  const combinedTsx = files
    .map((file) => `// FILE: ${file.path}\n${file.content}`)
    .join("\n\n");

  return {
    files,
    combinedTsx,
  };
}
