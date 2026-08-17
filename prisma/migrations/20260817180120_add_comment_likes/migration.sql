-- CreateTable
CREATE TABLE "comment_like" (
    "id" SERIAL NOT NULL,
    "commentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comment_like_commentId_idx" ON "comment_like"("commentId");

-- CreateIndex
CREATE INDEX "comment_like_userId_idx" ON "comment_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "comment_like_commentId_userId_key" ON "comment_like"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
