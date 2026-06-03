import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { resolveSubject } from "@/lib/subject-resolve";
import { extractPlaylistId, extractVideoId, fetchYoutubePlaylistVideos } from "@/lib/youtube-playlist";

type IncomingVideo = {
  title?: string;
  youtubeVideoId?: string;
  url?: string;
  durationSeconds?: number | null;
};

export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const playlistUrl = typeof body.playlistUrl === "string" ? body.playlistUrl.trim() : "";
  const folderName =
    typeof body.folderName === "string" && body.folderName.trim()
      ? body.folderName.trim()
      : extractPlaylistId(playlistUrl) ?? "Imported playlist";
  const subject = await resolveSubject(prisma, typeof body.subject === "string" ? body.subject : null);

  let videos: IncomingVideo[] = Array.isArray(body.videos) ? body.videos : [];
  if (!videos.length && playlistUrl) {
    videos = await fetchYoutubePlaylistVideos(playlistUrl);
  }

  const normalized = videos
    .map((video, index) => {
      const youtubeVideoId =
        typeof video.youtubeVideoId === "string"
          ? video.youtubeVideoId
          : typeof video.url === "string"
            ? extractVideoId(video.url)
            : null;
      if (!youtubeVideoId) return null;
      return {
        title: typeof video.title === "string" && video.title.trim() ? video.title.trim() : `Lecture ${index + 1}`,
        youtubeVideoId,
        durationSeconds:
          typeof video.durationSeconds === "number" && Number.isFinite(video.durationSeconds)
            ? Math.max(0, Math.round(video.durationSeconds))
            : null,
      };
    })
    .filter((video): video is { title: string; youtubeVideoId: string; durationSeconds: number | null } => Boolean(video));

  if (!normalized.length) {
    return NextResponse.json({ error: "No videos found in this playlist." }, { status: 400 });
  }

  const existing = await prisma.lecture.findMany({
    where: { userId, youtubeVideoId: { in: normalized.map((video) => video.youtubeVideoId) } },
    select: { youtubeVideoId: true },
  });
  const existingIds = new Set(existing.map((row) => row.youtubeVideoId).filter(Boolean));
  const toCreate = normalized.filter((video) => !existingIds.has(video.youtubeVideoId));

  const created = await Promise.all(
    toCreate.map(async (video) => {
      const lecture = await prisma.lecture.create({
        data: {
          userId,
          title: video.title,
          subjectId: subject.id,
          topic: folderName,
          youtubeVideoId: video.youtubeVideoId,
          durationSeconds: video.durationSeconds,
        },
      });
      await prisma.lectureWatch.create({
        data: {
          lectureId: lecture.id,
          userId,
          watchedPercent: 0,
          lastPositionSeconds: 0,
          completed: false,
        },
      });
      return lecture;
    }),
  );

  return NextResponse.json({
    ok: true,
    folderName,
    imported: created.length,
    skipped: normalized.length - created.length,
  });
}
