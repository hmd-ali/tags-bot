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
	update: async (name: string, data: Partial<TagCreateInput>) => {
		const updatedTag = await prisma.tag.update({
			where: { name },
			data,
		});
		TagsCache.delete(name);
		TagsCache.set(updatedTag);
		return updatedTag;
	},
	delete: async (name: string) => {
		try {
			const deleted = await prisma.tag.deleteMany({ where: { name } });
			if (deleted.count > 0) {
				TagsCache.delete(name);
			}
		} catch (error) {
			console.error("Error deleting tag from database:", error);
			throw error;
		}
	},
};
