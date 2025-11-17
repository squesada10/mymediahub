-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tmdbId" INTEGER,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "overview" TEXT,
    "posterUrl" TEXT,
    "genres" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_MediaItem" ("createdAt", "genres", "id", "overview", "posterUrl", "status", "title", "tmdbId", "type", "updatedAt") SELECT "createdAt", "genres", "id", "overview", "posterUrl", "status", "title", "tmdbId", "type", "updatedAt" FROM "MediaItem";
DROP TABLE "MediaItem";
ALTER TABLE "new_MediaItem" RENAME TO "MediaItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
