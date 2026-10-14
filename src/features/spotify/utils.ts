/**
 * Formats any Spotify link, track/album/playlist URL, or pasted <iframe> tag
 * into a valid Spotify embed iframe URL.
 */
export function formatSpotifyEmbedUrl(input?: string | null): string {
  if (!input) return "";
  let url = input.trim();

  // If a full <iframe> snippet was pasted, extract the src attribute
  const iframeMatch = url.match(/src=["'](.*?)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    url = iframeMatch[1].trim();
  }

  // Support:
  // - https://open.spotify.com/playlist/...
  // - https://open.spotify.com/intl-xx/playlist/...
  // - https://open.spotify.com/embed/playlist/...
  // - https://open.spotify.com/user/{userId}/playlist/...
  // - spotify:playlist:...
  const spotifyRegex =
    /(?:https?:\/\/open\.spotify\.com\/(?:intl-[a-z0-9_-]+\/)?(?:user\/[a-zA-Z0-9_-]+\/)?(?:embed\/)?|spotify:)(playlist|track|album|artist|show|episode)(?:\/|:)([a-zA-Z0-9]+)/i;
  const match = url.match(spotifyRegex);

  if (match) {
    const [, type, id] = match;
    return `https://open.spotify.com/embed/${type.toLowerCase()}/${id}?utm_source=generator`;
  }

  // If it already includes /embed/, keep it
  if (url.includes("open.spotify.com/embed/")) {
    return url;
  }

  return url;
}
