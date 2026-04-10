## Goal
Build a weekend MVP: Figma-to-Production Mini Builder web app.
Design direction: trynia.ai-inspired (premium AI landing style).

## Coding Priorities
1. Reuse existing files/components before creating new ones.
2. Keep outputs concise; avoid long explanations unless requested.
3. Make deterministic generation (same input -> same output).
4. Prefer section-based generation, never one giant generated file.
5. Map styles to tokens first, hardcoded values last.

## Workflow Rules
- Before coding, summarize plan in <=6 bullets.
- Batch related tool calls when possible.
- Read only needed files (avoid broad scans).
- After edits, run quick verification for touched paths only.
- Report only: what changed, why, and how to verify.

## Scope Guardrails (Weekend MVP)
- In scope: ingest Figma node, generate sections, save run history, preview deploy.
- Out of scope: full design-system parity, complex animation export, bidirectional sync.

## UI Style Rules
- Large hero + clean section rhythm + repeated clear CTA.
- Neutral base palette with one accent gradient.
- Rounded cards, subtle borders/shadows, minimal copy density.
- Restrained micro-interactions only.
