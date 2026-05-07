/*
  Warnings:

  - Added the required column `updatedAt` to the `tags` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tags" ("content", "desc", "id", "name", "userId", "uses") SELECT "content", "desc", "id", "name", "userId", "uses" FROM "tags";
DROP TABLE "tags";
ALTER TABLE "new_tags" RENAME TO "tags";
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE INDEX "tags_name_idx" ON "tags"("name");
CREATE INDEX "tags_userId_idx" ON "tags"("userId");
CREATE INDEX "tags_desc_idx" ON "tags"("desc");
CREATE INDEX "tags_uses_idx" ON "tags"("uses");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
