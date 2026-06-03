-- CreateTable
CREATE TABLE "HtmlGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HtmlGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HtmlGame_userId_updatedAt_idx" ON "HtmlGame"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "HtmlGame" ADD CONSTRAINT "HtmlGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
