import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import MarkdownRenderer from "@/components/MarkdownRenderer";

import { PublicFooter } from "@/components/PublicFooter";
import { JsonLd, absoluteUrl, breadcrumbSchema, createMetadata } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import { plainTextFromMarkdown, readingTimeMinutes, relatedContent } from "@/lib/content-utils";


type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED" } });
  
  if (!post) return {};
  
  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.featuredImage ?? undefined,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
  });
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getServerSession();
  
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { 
      author: { select: { id: true, name: true, email: true } }, 
      comments: { 
        where: { status: "PUBLISHED", parentId: null }, 
        include: { 
          author: { select: { name: true } }, 
          replies: { include: { author: { select: { name: true } } } } 
        }, 
        orderBy: { createdAt: "desc" } 
      } 
    },
  });

  if (!post) notFound();

  const text = plainTextFromMarkdown(post.content);
  const related = await relatedContent({ tags: post.tags, excludeSlug: post.slug, take: 4 });
  const reactionCounts = await prisma.contentReaction.groupBy({ 
    by: ["value"], 
    where: { targetType: "BLOG", targetId: post.id }, 
    _count: true 
  });

  // --- SERVER ACTIONS FOR INTERACTIVITY ---

  async function postComment(formData: FormData) {
    "use server";
    const session = await getServerSession();
    if (!session?.user?.email) throw new Error("Must be logged in to comment");

    const content = formData.get("content") as string;
    if (!content.trim()) return;

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return;

    await prisma.communityComment.create({
      data: {
        content,
        authorId: user.id,
        targetId: post!.id,
        targetType: "BLOG",
        status: "PUBLISHED",
      }
    });

    revalidatePath(`/blog/${slug}`);
  }

  async function addReaction(formData: FormData) {
    "use server";
    const session = await getServerSession();
    if (!session?.user?.email) return;

    const reactionValue = formData.get("reaction") as string;
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return;

    const existing = await prisma.contentReaction.findFirst({
      where: { userId: user.id, targetId: post!.id, targetType: "BLOG", value: reactionValue }
    });

    if (existing) {
      await prisma.contentReaction.delete({ where: { id: existing.id } });
    } else {
      await prisma.contentReaction.create({
        data: { value: reactionValue, userId: user.id, targetId: post!.id, targetType: "BLOG" }
      });
    }

    revalidatePath(`/blog/${slug}`);
  }

  // --- RENDER PAGE ---

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <JsonLd 
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" }, 
            { name: "Blog", path: "/blog" }, 
            { name: post.title, path: `/blog/${post.slug}` }
          ]), 
          { 
            "@context": "https://schema.org", 
            "@type": "Article", 
            headline: post.title, 
            description: post.excerpt, 
            datePublished: post.publishedAt?.toISOString(), 
            dateModified: post.updatedAt.toISOString(), 
            author: { "@type": "Person", name: post.author.name ?? "GATEPrep Author" }, 
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`) 
          }
        ]} 
      />
      
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-10 md:py-16">
        
        {/* --- HEADER --- */}
        <header className="space-y-6">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Blog
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {post.category ?? "GATE Blog"}
            </span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:leading-[1.1]">
            {post.title}
          </h1>
          
          <p className="text-xl leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-lg text-foreground font-semibold">
              {(post.author.name ?? "G")[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">
                {post.author.name ?? "GATEPrep Author"}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.publishedAt && <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>}
                <span>•</span>
                <span>{readingTimeMinutes(text)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* --- MARKDOWN CONTENT --- */}
        <MarkdownRenderer content={post.content} />
        {/* <pre className="whitespace-pre-wrap border p-4">
          {post.content}
        </pre> */}

        {/* --- REACTIONS BAR --- */}
        <div className="flex items-center gap-4 py-6 border-y border-border">
          <span className="font-medium">Helpful?</span>
          <form action={addReaction} className="flex gap-2">
            {["👍", "❤️", "🔥", "💡"].map((emoji) => {
              const count = reactionCounts.find(r => r.value === emoji)?._count || 0;
              return (
                <button 
                  key={emoji}
                  type="submit" 
                  name="reaction" 
                  value={emoji}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <span>{emoji}</span>
                  {count > 0 && <span className="text-muted-foreground">{count}</span>}
                </button>
              );
            })}
          </form>
        </div>

        {/* --- COMMENTS SECTION --- */}
        <section className="space-y-8" id="comments">
          <h2 className="text-2xl font-bold tracking-tight">Discussion ({post.comments.length})</h2>
          
          {/* Add Comment Form */}
          {session?.user ? (
            <form action={postComment} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <textarea
                name="content"
                required
                rows={3}
                placeholder="Share your thoughts or ask a question..."
                className="w-full resize-none rounded-md bg-transparent p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex justify-end">
                <button type="submit" className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-border bg-secondary/50 p-6 text-center">
              <p className="text-muted-foreground">Please log in to join the discussion.</p>
              <Link href="/api/auth/signin" className="mt-3 inline-block font-medium text-primary hover:underline">
                Sign in to comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="group flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary font-medium">
                    {(comment.author.name ?? "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="rounded-xl border border-border bg-card p-4">
                      <p className="font-semibold text-sm">{comment.author.name ?? "Reader"}</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/90">{comment.content}</p>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                              {(reply.author.name ?? "U")[0].toUpperCase()}
                            </div>
                            <div className="flex-1 rounded-xl bg-secondary/30 p-3">
                              <p className="text-xs font-semibold">{reply.author.name ?? "Reader"}</p>
                              <p className="mt-1 text-sm text-foreground/80">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-10">No comments yet. Start the conversation!</p>
            )}
          </div>
        </section>

        {/* --- RELATED POSTS --- */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-border">
            <h3 className="text-xl font-bold mb-6">Keep Reading</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                >
                  <h4 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <PublicFooter />
    </div>
  );
}