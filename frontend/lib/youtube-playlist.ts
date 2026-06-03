type PlaylistVideo = {
  title: string;
  youtubeVideoId: string;
  durationSeconds?: number | null;
};

function getText(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const node = value as Record<string, unknown>;
  if (typeof node.simpleText === "string") return node.simpleText;
  if (Array.isArray(node.runs)) {
    return node.runs
      .map((run) => (run && typeof run === "object" ? (run as { text?: unknown }).text : null))
      .filter((text): text is string => typeof text === "string")
      .join("")
      .trim();
  }
  return null;
}

function parseDurationSeconds(label?: string | null): number | null {
  if (!label) return null;
  const parts = label.split(":").map((part) => Number(part));
  if (parts.some((part) => !Number.isFinite(part))) return null;
  return parts.reduce((acc, part) => acc * 60 + part, 0);
}

function walk(value: unknown, visit: (node: Record<string, unknown>) => void) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item) => walk(item, visit));
    return;
  }
  const node = value as Record<string, unknown>;
  visit(node);
  Object.values(node).forEach((child) => walk(child, visit));
}

function extractInitialData(html: string): unknown | null {
  const match = html.match(/ytInitialData\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
  if (!match?.[1]) return null;
  try {
    return JSON.parse(match[1]) as unknown;
  } catch {
    return null;
  }
}

export function extractPlaylistId(input: string): string | null {
  try {
    const url = new URL(input);
    return url.searchParams.get("list");
  } catch {
    const match = input.match(/[?&]list=([^&\s]+)/);
    return match?.[1] ?? null;
  }
}

export function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] ?? null;
    return url.searchParams.get("v");
  } catch {
    const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
    return match?.[1] ?? null;
  }
}

export async function fetchYoutubePlaylistVideos(playlistUrl: string): Promise<PlaylistVideo[]> {
  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) throw new Error("Paste a valid YouTube playlist URL with a list= id.");

  const res = await fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
      "accept-language": "en-US,en;q=0.9",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not fetch the YouTube playlist.");

  const html = await res.text();
  const initialData = extractInitialData(html);
  const seen = new Set<string>();
  const videos: PlaylistVideo[] = [];

  if (initialData) {
    walk(initialData, (node) => {
      if (typeof node.videoId !== "string") return;
      const videoId = node.videoId;
      if (seen.has(videoId)) return;

      const title =
        getText(node.title) ??
        getText(node.shortBylineText) ??
        `Lecture ${videos.length + 1}`;
      const durationText = getText(node.lengthText);
      seen.add(videoId);
      videos.push({
        title,
        youtubeVideoId: videoId,
        durationSeconds: parseDurationSeconds(durationText),
      });
    });
  }

  if (!videos.length) {
    for (const match of html.matchAll(/"videoId":"([a-zA-Z0-9_-]{6,})"/g)) {
      const videoId = match[1];
      if (!videoId || seen.has(videoId)) continue;
      seen.add(videoId);
      videos.push({ title: `Lecture ${videos.length + 1}`, youtubeVideoId: videoId });
    }
  }

  return videos.slice(0, 150);
}
