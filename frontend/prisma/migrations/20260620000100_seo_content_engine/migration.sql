CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "SeoResourceKind" AS ENUM ('NOTE', 'FORMULA', 'PYQ', 'QUIZ');
CREATE TYPE "ReactionTargetType" AS ENUM ('BLOG', 'VLOG', 'RESOURCE', 'COMMENT');
CREATE TYPE "ReactionValue" AS ENUM ('LIKE', 'UPVOTE', 'DOWNVOTE');

CREATE TABLE "GateBranchPage" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "syllabus" JSONB NOT NULL,
  "importantTopics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "books" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "preparation" TEXT NOT NULL,
  "faqs" JSONB,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GateBranchPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SubjectSeoPage" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "branchCode" TEXT NOT NULL DEFAULT 'ee',
  "subjectName" TEXT NOT NULL,
  "overview" TEXT NOT NULL,
  "syllabus" JSONB,
  "importantTopics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "books" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "strategy" TEXT,
  "faqs" JSONB,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SubjectSeoPage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SeoResource" (
  "id" TEXT NOT NULL,
  "kind" "SeoResourceKind" NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "branchCode" TEXT NOT NULL DEFAULT 'ee',
  "subjectSlug" TEXT,
  "topic" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "featuredImage" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SeoResource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BlogPost" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "markdown" TEXT,
  "category" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "featuredImage" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VlogPost" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "videoUrl" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VlogPost_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityComment" (
  "id" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "blogId" TEXT,
  "vlogId" TEXT,
  "parentId" TEXT,
  "content" TEXT NOT NULL,
  "status" "PublishStatus" NOT NULL DEFAULT 'PUBLISHED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CommunityComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentReaction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "targetType" "ReactionTargetType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "value" "ReactionValue" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentReaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContentBookmark" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "targetType" "ReactionTargetType" NOT NULL,
  "targetId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContentBookmark_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserFollow" (
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("followerId","followingId")
);

CREATE TABLE "SearchQueryLog" (
  "id" TEXT NOT NULL,
  "query" TEXT NOT NULL,
  "resultCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SearchQueryLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GateBranchPage_code_key" ON "GateBranchPage"("code");
CREATE UNIQUE INDEX "GateBranchPage_slug_key" ON "GateBranchPage"("slug");
CREATE UNIQUE INDEX "SubjectSeoPage_slug_key" ON "SubjectSeoPage"("slug");
CREATE INDEX "SubjectSeoPage_branchCode_status_idx" ON "SubjectSeoPage"("branchCode", "status");
CREATE UNIQUE INDEX "SeoResource_slug_key" ON "SeoResource"("slug");
CREATE INDEX "SeoResource_kind_status_publishedAt_idx" ON "SeoResource"("kind", "status", "publishedAt");
CREATE INDEX "SeoResource_subjectSlug_status_idx" ON "SeoResource"("subjectSlug", "status");
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");
CREATE INDEX "BlogPost_authorId_status_idx" ON "BlogPost"("authorId", "status");
CREATE UNIQUE INDEX "VlogPost_slug_key" ON "VlogPost"("slug");
CREATE INDEX "VlogPost_status_publishedAt_idx" ON "VlogPost"("status", "publishedAt");
CREATE INDEX "VlogPost_authorId_status_idx" ON "VlogPost"("authorId", "status");
CREATE INDEX "CommunityComment_blogId_createdAt_idx" ON "CommunityComment"("blogId", "createdAt");
CREATE INDEX "CommunityComment_vlogId_createdAt_idx" ON "CommunityComment"("vlogId", "createdAt");
CREATE INDEX "CommunityComment_parentId_idx" ON "CommunityComment"("parentId");
CREATE UNIQUE INDEX "ContentReaction_userId_targetType_targetId_key" ON "ContentReaction"("userId", "targetType", "targetId");
CREATE INDEX "ContentReaction_targetType_targetId_idx" ON "ContentReaction"("targetType", "targetId");
CREATE UNIQUE INDEX "ContentBookmark_userId_targetType_targetId_key" ON "ContentBookmark"("userId", "targetType", "targetId");
CREATE INDEX "ContentBookmark_targetType_targetId_idx" ON "ContentBookmark"("targetType", "targetId");
CREATE INDEX "UserFollow_followingId_idx" ON "UserFollow"("followingId");
CREATE INDEX "SearchQueryLog_query_idx" ON "SearchQueryLog"("query");
CREATE INDEX "SearchQueryLog_createdAt_idx" ON "SearchQueryLog"("createdAt");

ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VlogPost" ADD CONSTRAINT "VlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_vlogId_fkey" FOREIGN KEY ("vlogId") REFERENCES "VlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityComment" ADD CONSTRAINT "CommunityComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CommunityComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentReaction" ADD CONSTRAINT "ContentReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentBookmark" ADD CONSTRAINT "ContentBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
