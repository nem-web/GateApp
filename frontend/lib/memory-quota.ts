import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ADMIN_ROLE } from "@/lib/admin-config";
import { uploadRoot } from "@/lib/local-upload-storage";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, getUserPlan } from "@/lib/subscription";

export const FREE_MEMORY_QUOTA_BYTES = PLAN_LIMITS.TRIAL.storage_bytes;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function toNumber(value: unknown) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return 0;
}

async function folderSizeBytes(folder: string): Promise<number> {
  try {
    const info = await stat(folder);
    if (info.isFile()) return info.size;
    if (!info.isDirectory()) return 0;
  } catch {
    return 0;
  }

  const entries = await readdir(folder, { withFileTypes: true });
  const sizes = await Promise.all(
    entries.map((entry) => folderSizeBytes(path.join(folder, entry.name))),
  );
  return sizes.reduce((sum, size) => sum + size, 0);
}

async function databaseUsageBytes(userId: string) {
  const rows = await prisma.$queryRaw<Array<{ bytes: bigint | number | null }>>`
    SELECT (
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE(content, '')) +
        OCTET_LENGTH(COALESCE(topic, '')) +
        OCTET_LENGTH(COALESCE("pdfStoragePath", '')) +
        OCTET_LENGTH(COALESCE("pdfFileName", '')) +
        OCTET_LENGTH(COALESCE(tags::text, ''))
      ) FROM "Note" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE("storagePath", '')) +
        OCTET_LENGTH(COALESCE("fileName", ''))
      ) FROM "NotePdf" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(payload::text, ''))
      ) FROM "NoteAnnotation"
      WHERE "notePdfId" IN (SELECT id FROM "NotePdf" WHERE "userId" = ${userId})), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(front, '')) +
        OCTET_LENGTH(COALESCE(back, '')) +
        OCTET_LENGTH(COALESCE(topic, '')) +
        OCTET_LENGTH(COALESCE(source, ''))
      ) FROM "Flashcard" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE(topic, '')) +
        OCTET_LENGTH(COALESCE("youtubeVideoId", '')) +
        OCTET_LENGTH(COALESCE("storagePath", '')) +
        OCTET_LENGTH(COALESCE(difficulty, ''))
      ) FROM "Lecture" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE("questionPdfPath", '')) +
        OCTET_LENGTH(COALESCE("solutionPdfPath", '')) +
        OCTET_LENGTH(COALESCE("answerKeyPdfPath", '')) +
        OCTET_LENGTH(COALESCE(topic, '')) +
        OCTET_LENGTH(COALESCE(difficulty, ''))
      ) FROM "PyqPaper" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE("storagePath", '')) +
        OCTET_LENGTH(COALESCE("fileName", '')) +
        OCTET_LENGTH(COALESCE(metadata::text, ''))
      ) FROM "TestPaperUpload" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(prompt, '')) +
        OCTET_LENGTH(COALESCE(topic, '')) +
        OCTET_LENGTH(COALESCE(type, '')) +
        OCTET_LENGTH(COALESCE(options::text, '')) +
        OCTET_LENGTH(COALESCE(difficulty, '')) +
        OCTET_LENGTH(COALESCE(source, ''))
      ) FROM "Question" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE("userAnswers"::text, '')) +
        OCTET_LENGTH(COALESCE("topicBreakdown"::text, '')) +
        OCTET_LENGTH(COALESCE("weakTopics"::text, ''))
      ) FROM "TestAttempt" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE(slots::text, ''))
      ) FROM "StudyPlan" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE(priority, '')) +
        OCTET_LENGTH(COALESCE("topicTag", '')) +
        OCTET_LENGTH(COALESCE(repeat, '')) +
        OCTET_LENGTH(COALESCE("lectureRef", ''))
      ) FROM "Task" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(type, '')) +
        OCTET_LENGTH(COALESCE(content, ''))
      ) FROM "AISuggestion" WHERE "userId" = ${userId}), 0) +
      COALESCE((SELECT SUM(
        OCTET_LENGTH(COALESCE(title, '')) +
        OCTET_LENGTH(COALESCE(html, ''))
      ) FROM "HtmlGame" WHERE "userId" = ${userId}), 0)
    ) AS bytes
  `;

  return toNumber(rows[0]?.bytes);
}

export async function getUserMemoryUsage(userId: string) {
  const [user, plan, dbBytes, localUploadBytes] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
    getUserPlan(userId),
    databaseUsageBytes(userId),
    folderSizeBytes(path.join(uploadRoot(), userId)),
  ]);

  return {
    isAdmin: user?.role === ADMIN_ROLE,
    isPremium: Boolean(plan?.isPremium),
    usedBytes: dbBytes + localUploadBytes,
    dbBytes,
    localUploadBytes,
    quotaBytes: plan?.limits.storage_bytes ?? FREE_MEMORY_QUOTA_BYTES,
  };
}

export async function requireMemoryQuota(userId: string, incomingBytes = 0) {
  const usage = await getUserMemoryUsage(userId);
  if (usage.isAdmin || usage.isPremium) return null;

  const projectedBytes = usage.usedBytes + Math.max(0, incomingBytes);
  if (projectedBytes <= usage.quotaBytes) return null;

  return NextResponse.json(
    {
      error: `Free memory limit reached. You have ${formatBytes(usage.usedBytes)} stored and this would exceed the ${formatBytes(usage.quotaBytes)} quota. Upgrade to premium to continue.`,
      quotaExceeded: true,
      upgradeRequired: true,
      billingUrl: "/upgrade",
      usage: {
        usedBytes: usage.usedBytes,
        incomingBytes,
        projectedBytes,
        quotaBytes: usage.quotaBytes,
      },
    },
    { status: 402 },
  );
}

export function byteLength(value: string) {
  return Buffer.byteLength(value, "utf8");
}
