import type { TagCreateInput } from "@generated/prisma/models.js";
import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";

export const TagsManager = {
	get: async (name: string) => {
		let tag = TagsCache.get(name);
		if (tag === null) {
			tag = await prisma.tag.findUnique({ where: { name } });
			if (tag === null) {
				return null;
			}
			TagsCache.set(tag);
		}
		return tag;
	},
	create: async (tag: TagCreateInput) => {
		const createdTag = await prisma.tag.create({ data: tag });
		TagsCache.set(createdTag);
		return createdTag;
	},
	delete: async (name: string) => {
		await prisma.tag.delete({ where: { name } });
		TagsCache.delete(name);
	},
};
