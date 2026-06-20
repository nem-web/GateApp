import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentAdminUser } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";
import { slugify, plainTextFromMarkdown } from "@/lib/content-utils";

function status(value: unknown) {
  return value === "PUBLISHED" || value === "REVIEW" || value === "ARCHIVED" ? value : "DRAFT";
}

function tags(value: unknown) {
  return Array.isArray(value) ? value.map(String).map((v) => v.trim()).filter(Boolean).slice(0, 20) : [];
}

export async function GET(req: Request) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "blog";
  const take = Math.min(100, Math.max(1, Number(searchParams.get("take") ?? 50)));

  if (type === "vlog") {
    return NextResponse.json({ items: await prisma.vlogPost.findMany({ orderBy: { updatedAt: "desc" }, take }) });
  }
  if (type === "resource") {
    return NextResponse.json({ items: await prisma.seoResource.findMany({ orderBy: { updatedAt: "desc" }, take }) });
  }
  if (type === "subject") {
    return NextResponse.json({ items: await prisma.subjectSeoPage.findMany({ orderBy: { updatedAt: "desc" }, take }) });
  }
  if (type === "branch") {
    return NextResponse.json({ items: await prisma.gateBranchPage.findMany({ orderBy: { updatedAt: "desc" }, take }) });
  }
  return NextResponse.json({ items: await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take }) });
}

export async function POST(req: Request) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = (await req.json()) as Record<string, unknown>;
  const type = String(body.type ?? "blog");
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
  const slug = slugify(String(body.slug ?? title));
  const publishStatus = status(body.status);
  const publishedAt = publishStatus === "PUBLISHED" ? new Date() : null;

  if (type === "vlog") {
    const videoUrl = String(body.videoUrl ?? "").trim();
    if (!videoUrl) return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
    const item = await prisma.vlogPost.upsert({
      where: { slug },
      update: {
        title,
        excerpt: String(body.excerpt ?? plainTextFromMarkdown(String(body.content ?? "")).slice(0, 240)),
        content: String(body.content ?? ""),
        videoUrl,
        thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : null,
        tags: tags(body.tags),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription ? String(body.seoDescription) : null,
        status: publishStatus,
        ...(publishedAt && { publishedAt }),
      },
      create: {
        authorId: admin.id,
        slug,
        title,
        excerpt: String(body.excerpt ?? plainTextFromMarkdown(String(body.content ?? "")).slice(0, 240)),
        content: String(body.content ?? ""),
        videoUrl,
        thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : null,
        tags: tags(body.tags),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription ? String(body.seoDescription) : null,
        status: publishStatus,
        publishedAt,
      },
    });
    return NextResponse.json({ item });
  }

  if (type === "resource") {
    const kind = String(body.kind ?? "NOTE");
    if (!["NOTE", "FORMULA", "PYQ", "QUIZ"].includes(kind)) return NextResponse.json({ error: "Invalid resource kind" }, { status: 400 });
    const item = await prisma.seoResource.upsert({
      where: { slug },
      update: {
        kind: kind as Prisma.SeoResourceKind,
        title,
        description: String(body.description ?? ""),
        content: String(body.content ?? ""),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        branchCode: String(body.branchCode ?? "ee"),
        subjectSlug: body.subjectSlug ? String(body.subjectSlug) : null,
        topic: body.topic ? String(body.topic) : null,
        tags: tags(body.tags),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription ? String(body.seoDescription) : null,
        featuredImage: body.featuredImage ? String(body.featuredImage) : null,
        status: publishStatus,
        ...(publishedAt && { publishedAt }),
      },
      create: {
        kind: kind as Prisma.SeoResourceKind,
        slug,
        title,
        description: String(body.description ?? ""),
        content: String(body.content ?? ""),
        excerpt: body.excerpt ? String(body.excerpt) : null,
        branchCode: String(body.branchCode ?? "ee"),
        subjectSlug: body.subjectSlug ? String(body.subjectSlug) : null,
        topic: body.topic ? String(body.topic) : null,
        tags: tags(body.tags),
        seoTitle: body.seoTitle ? String(body.seoTitle) : null,
        seoDescription: body.seoDescription ? String(body.seoDescription) : null,
        featuredImage: body.featuredImage ? String(body.featuredImage) : null,
        status: publishStatus,
        publishedAt,
      },
    });
    return NextResponse.json({ item });
  }

  const item = await prisma.blogPost.upsert({
    where: { slug },
    update: {
      title,
      excerpt: String(body.excerpt ?? plainTextFromMarkdown(String(body.content ?? "")).slice(0, 240)),
      content: String(body.content ?? ""),
      markdown: body.markdown ? String(body.markdown) : null,
      category: body.category ? String(body.category) : null,
      tags: tags(body.tags),
      seoTitle: body.seoTitle ? String(body.seoTitle) : null,
      seoDescription: body.seoDescription ? String(body.seoDescription) : null,
      featuredImage: body.featuredImage ? String(body.featuredImage) : null,
      status: publishStatus,
      ...(publishedAt && { publishedAt }),
    },
    create: {
      authorId: admin.id,
      slug,
      title,
      excerpt: String(body.excerpt ?? plainTextFromMarkdown(String(body.content ?? "")).slice(0, 240)),
      content: String(body.content ?? ""),
      markdown: body.markdown ? String(body.markdown) : null,
      category: body.category ? String(body.category) : null,
      tags: tags(body.tags),
      seoTitle: body.seoTitle ? String(body.seoTitle) : null,
      seoDescription: body.seoDescription ? String(body.seoDescription) : null,
      featuredImage: body.featuredImage ? String(body.featuredImage) : null,
      status: publishStatus,
      publishedAt,
    },
  });
  return NextResponse.json({ item });
}
