import type { ReactNode } from "react";

type TipTapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  content?: TipTapNode[];
};

function renderMarks(text: string, marks?: TipTapNode["marks"]): ReactNode {
  if (!marks?.length) return text;
  return marks.reduce<ReactNode>((acc, mark) => {
    if (mark.type === "bold") return <strong>{acc}</strong>;
    if (mark.type === "italic") return <em>{acc}</em>;
    if (mark.type === "code") {
      return <code className="rounded bg-surface px-1.5 py-0.5">{acc}</code>;
    }
    if (mark.type === "link") {
      const href = String(mark.attrs?.href ?? "#");
      return (
        <a href={href} className="underline">
          {acc}
        </a>
      );
    }
    return acc;
  }, text);
}

function renderNode(node: TipTapNode, index: number): ReactNode {
  const children = node.content?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "doc":
      return <>{children}</>;
    case "paragraph":
      return (
        <p key={index} className="mb-4 leading-relaxed text-foreground/90">
          {children}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const className =
        level === 1
          ? "mb-4 mt-8 font-display text-3xl"
          : level === 2
            ? "mb-3 mt-8 font-display text-2xl"
            : "mb-3 mt-6 font-display text-xl";
      if (level === 1) return <h1 key={index} className={className}>{children}</h1>;
      if (level === 3) return <h3 key={index} className={className}>{children}</h3>;
      return <h2 key={index} className={className}>{children}</h2>;
    }
    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-6 border-l-4 border-primary pl-4 text-muted"
        >
          {children}
        </blockquote>
      );
    case "bulletList":
      return (
        <ul key={index} className="mb-4 list-disc space-y-1 pl-5">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={index} className="mb-4 list-decimal space-y-1 pl-5">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={index}>{children}</li>;
    case "horizontalRule":
      return <hr key={index} className="my-8 border-border" />;
    case "codeBlock":
      return (
        <pre
          key={index}
          className="mb-4 overflow-x-auto rounded-xl bg-surface p-4 text-sm"
        >
          <code>{node.content?.map((c) => c.text).join("")}</code>
        </pre>
      );
    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={String(node.attrs?.src ?? "")}
          alt={String(node.attrs?.alt ?? "")}
          className="my-6 w-full rounded-2xl"
        />
      );
    case "youtube":
    case "iframe": {
      const src = String(node.attrs?.src ?? node.attrs?.url ?? "");
      if (!src) return null;
      return (
        <div key={index} className="my-6 aspect-video overflow-hidden rounded-2xl">
          <iframe
            src={src}
            title="Embedded media"
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      );
    }
    case "text":
      return <span key={index}>{renderMarks(node.text ?? "", node.marks)}</span>;
    case "hardBreak":
      return <br key={index} />;
    default:
      return <div key={index}>{children}</div>;
  }
}

export function TiptapRenderer({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") {
    return <p className="text-muted">This article has no content yet.</p>;
  }
  return <div>{renderNode(content as TipTapNode, 0)}</div>;
}
