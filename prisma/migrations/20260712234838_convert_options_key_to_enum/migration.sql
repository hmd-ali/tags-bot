-- Backfill existing key to match new enum naming
UPDATE "options" SET "key" = 'TAG_PREFIX' WHERE "key" = 'tag_prefix';