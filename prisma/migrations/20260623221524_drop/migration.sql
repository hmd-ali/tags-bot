/*
  Warnings:

  - You are about to drop the column `name` on the `tags` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tags" ("content", "createdAt", "desc", "id", "updatedAt", "userId", "uses") SELECT "content", "createdAt", "desc", "id", "updatedAt", "userId", "uses" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE INDEX "tags_userId_idx" ON "tags"("userId");
CREATE INDEX "tags_desc_idx" ON "tags"("desc");
CREATE INDEX "tags_uses_idx" ON "tags"("uses");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
