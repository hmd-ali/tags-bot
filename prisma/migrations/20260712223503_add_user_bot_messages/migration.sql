-- CreateTable
CREATE TABLE "user_bot_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "user_bot_messages_userId_channelId_idx" ON "user_bot_messages"("userId", "channelId");
