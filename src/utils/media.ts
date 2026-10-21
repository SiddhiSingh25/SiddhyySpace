export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(trimmed) ||
    trimmed.includes("/video/upload/") ||
    trimmed.includes("youtube.com") ||
    trimmed.includes("youtu.be") ||
    trimmed.includes("vimeo.com")
  );
}

export function isDirectVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  return (
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(trimmed) ||
    trimmed.includes("/video/upload/")
  );
}

export function toVideoEmbedUrl(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
}
