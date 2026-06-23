"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function publishPostAction(formData: FormData) {
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string; 
  const category = formData.get("category") as string;
  const authorId = formData.get("authorId") as string;

  // 1. Validation
  if (!title || title.trim().length < 5) {
    return { error: "Title must be at least 5 characters long." };
  }
  if (!content || content.trim().length < 20) {
    return { error: "Content is too short. Please provide more details." };
  }
  if (!authorId) {
    return { error: "Authentication error. Could not verify author." };
  }

  // 2. Create unique slug
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const uniqueSlug = `${baseSlug}-${Date.now()}`;

  // 3. Database operation
  try {
    await prisma.blogPost.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt,
        content,
        category: category || "General Discussion",
        authorId,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to publish post:", error);
    return { error: "Failed to save post to the database. Please try again." };
  }

  // 4. Redirect (Must be outside the try-catch block in Next.js Server Actions)
  redirect(`/blog/${uniqueSlug}`);
}