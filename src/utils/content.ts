import slugifyLib from "slugify";

export function slugify(value: string) {
  return slugifyLib(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function readingTimeFromText(text: string, wordsPerMinute = 200) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function extractTextFromTiptap(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";

  const parts: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: string; text?: string; content?: unknown[] };
    if (typeof n.text === "string") parts.push(n.text);
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };

  walk(doc);
  return parts.join(" ");
}

export function resolveReadingTime(
  content: unknown,
  override?: number | null,
) {
  if (typeof override === "number" && override > 0) return override;
  return readingTimeFromText(extractTextFromTiptap(content));
}
