import type { Tag } from "@generated/prisma/client.js";
import { LRUCache } from "lru-cache/raw";

const cache = new LRUCache<string, Tag>({
	max: 100,
	ttl: 30 * 24 * 60 * 60 * 1000,
});

export const TagsCache = {
	get: (name: string) => cache.get(name) ?? null,
	set: (tag: Tag) => cache.set(tag.name, tag),
	delete: (name: string) => cache.delete(name),
	clear: () => cache.clear(),
};
