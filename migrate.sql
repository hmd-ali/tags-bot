INSERT INTO tag_aliases (name, tagId)
SELECT t.name, t.id
FROM tags t
WHERE NOT EXISTS (
  SELECT 1 FROM tag_aliases a
  WHERE a.name = t.name
);