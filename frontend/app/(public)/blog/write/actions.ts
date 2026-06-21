"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function publishPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string; // This is now Markdown!
  const category = formData.get("category") as string;
  const authorId = formData.get("authorId") as string;

  if (!title || !content || !authorId) {
    throw new Error("Missing required fields");
  }

  // Create unique slug
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  await prisma.blogPost.create({
    data: {
      title,
      slug: uniqueSlug,
      excerpt,
      content,
      category: category || "Community",
      authorId,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // Redirect to the newly created post
  redirect(`/blog/${uniqueSlug}`);
}