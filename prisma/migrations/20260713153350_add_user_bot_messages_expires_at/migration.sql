-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_bot_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL DEFAULT (datetime('now', '+7 days'))
);
INSERT INTO "new_user_bot_messages" ("channelId", "id", "userId") SELECT "channelId", "id", "userId" FROM "user_bot_messages";
DROP TABLE "user_bot_messages";
ALTER TABLE "new_user_bot_messages" RENAME TO "user_bot_messages";
CREATE INDEX "user_bot_messages_expiresAt_idx" ON "user_bot_messages"("expiresAt");
CREATE INDEX "user_bot_messages_userId_channelId_idx" ON "user_bot_messages"("userId", "channelId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
