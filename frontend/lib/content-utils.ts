import { prisma } from "@/lib/prisma";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function readingTimeMinutes(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function plainTextFromMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function relatedContent(args: {
  tags?: string[];
  subjectSlug?: string | null;
  excludeSlug?: string;
  take?: number;
}) {
  const take = args.take ?? 6;
  const tags = args.tags ?? [];
  const [resources, blogs, vlogs] = await Promise.all([
    prisma.seoResource.findMany({
      where: {
        status: "PUBLISHED",
        slug: args.excludeSlug ? { not: args.excludeSlug } : undefined,
        OR: [
          ...(args.subjectSlug ? [{ subjectSlug: args.subjectSlug }] : []),
          ...(tags.length ? [{ tags: { hasSome: tags } }] : []),
        ],
      },
      orderBy: { publishedAt: "desc" },
      take,
    }),
    prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        slug: args.excludeSlug ? { not: args.excludeSlug } : undefined,
        ...(tags.length ? { tags: { hasSome: tags } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take,
    }),
    prisma.vlogPost.findMany({
      where: {
        status: "PUBLISHED",
        slug: args.excludeSlug ? { not: args.excludeSlug } : undefined,
        ...(tags.length ? { tags: { hasSome: tags } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      take,
    }),
  ]);

  return [
    ...resources.map((item) => ({ title: item.title, href: resourceHref(item.kind, item.slug), type: item.kind })),
    ...blogs.map((item) => ({ title: item.title, href: `/blog/${item.slug}`, type: "BLOG" })),
    ...vlogs.map((item) => ({ title: item.title, href: `/vlogs/${item.slug}`, type: "VLOG" })),
  ].slice(0, take);
}

export function resourceHref(kind: string, slug: string) {
  const base = {
    NOTE: "/notes",
    FORMULA: "/formula",
    PYQ: "/pyq",
    QUIZ: "/quiz",
  }[kind] ?? "/resources";
  return `${base}/${slug}`;
}

const blockedWords = ["spamword", "casino", "adult"];

export function validateCommunityText(text: string) {
  const normalized = text.toLowerCase();
  if (text.trim().length < 3) return "Content is too short.";
  if (blockedWords.some((word) => normalized.includes(word))) return "Content failed the community quality filter.";
  return null;
}

export async function rateLimitUserAction(userId: string, feature: string, maxPerHour: number) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.usageEvent.count({
    where: { userId, feature, createdAt: { gte: since } },
  });
  if (count >= maxPerHour) return false;
  await prisma.usageEvent.create({ data: { userId, feature } });
  return true;
}
