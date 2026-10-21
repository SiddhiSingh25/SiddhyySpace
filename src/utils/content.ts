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

export function extractTextFromContent(doc: unknown): string {
  if (!doc) return "";

  if (typeof doc === "string") {
    return doc.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  if (typeof doc === "object") {
    if ("html" in (doc as Record<string, unknown>)) {
      const htmlStr = (doc as Record<string, unknown>).html;
      if (typeof htmlStr === "string") {
        return htmlStr.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      }
    }

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

  return "";
}

export const extractTextFromTiptap = extractTextFromContent;

export function resolveReadingTime(
  content: unknown,
  override?: number | null,
) {
  if (typeof override === "number" && override > 0) return override;
  return readingTimeFromText(extractTextFromContent(content));
}
