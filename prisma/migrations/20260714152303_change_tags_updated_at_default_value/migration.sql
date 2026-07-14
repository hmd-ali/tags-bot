-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "lastModifiedBy" TEXT NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tags" ("content", "createdAt", "desc", "id", "lastModifiedBy", "updatedAt", "uses") SELECT "content", "createdAt", "desc", "id", "lastModifiedBy", "updatedAt", "uses" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE INDEX "tags_desc_idx" ON "tags"("desc");
CREATE INDEX "tags_uses_idx" ON "tags"("uses");
CREATE TABLE "new_user_bot_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL DEFAULT (datetime('now', '+7 days'))
);
INSERT INTO "new_user_bot_messages" ("channelId", "expiresAt", "id", "userId") SELECT "channelId", "expiresAt", "id", "userId" FROM "user_bot_messages";
DROP TABLE "user_bot_messages";
ALTER TABLE "new_user_bot_messages" RENAME TO "user_bot_messages";
CREATE INDEX "user_bot_messages_expiresAt_idx" ON "user_bot_messages"("expiresAt");
CREATE INDEX "user_bot_messages_userId_channelId_idx" ON "user_bot_messages"("userId", "channelId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
