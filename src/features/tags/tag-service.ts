import type { Tag, TagAlias } from "@generated/prisma/client.js";
import { LRUCache } from "lru-cache/raw";
import { prisma } from "@/db/prisma.js";

type FullTag = Tag & { aliases: TagAlias[] };

const BY_NAME = new LRUCache<string, FullTag>({
	max: 500,
	ttl: 1000 * 60 * 10,
});
const BY_ID = new LRUCache<number, FullTag>({ max: 500, ttl: 1000 * 60 * 10 });

const include = { aliases: true } as const;

function store(tag: FullTag): void {
	BY_ID.set(tag.id, tag);
	for (const alias of tag.aliases) {
		BY_NAME.set(alias.name, tag);
	}
}

function evict(tag: FullTag): void {
	BY_ID.delete(tag.id);
	for (const alias of tag.aliases) {
		BY_NAME.delete(alias.name);
	}
}

export const TagService = {
	async getByName(name: string): Promise<FullTag | null> {
		const cached = BY_NAME.get(name);
		if (cached) return cached;

		const tag = await prisma.tag.findFirst({
			where: { aliases: { some: { name } } },
			include,
		});

		if (tag) store(tag);
		return tag;
	},

	async getById(id: number): Promise<FullTag | null> {
		const cached = BY_ID.get(id);
		if (cached) return cached;

		const tag = await prisma.tag.findUnique({ where: { id }, include });
		if (tag) store(tag);
		return tag;
	},

	async create(data: {
		content: string;
		desc: string;
		userId: string;
		aliases: string[];
	}): Promise<FullTag> {
		const tag = await prisma.tag.create({
			data: {
				content: data.content,
				desc: data.desc,
				lastModifiedBy: data.userId,
				aliases: {
					create: data.aliases.map((name) => ({ name })),
				},
			},
			include,
		});
		store(tag);
		return tag;
	},

	async update(
		aliasName: string,
		data: {
			content: string;
			desc: string;
			aliases: string[];
			userId: string;
		}
	): Promise<FullTag | null> {
		const existing = await this.getByName(aliasName);
		if (!existing) return null;

		if (data.aliases.length === 0) {
			throw new Error("Cannot update a tag to have no aliases.");
		}

		evict(existing);

		await prisma.$transaction([
			prisma.tag.update({
				where: { id: existing.id },
				data: {
					content: data.content,
					desc: data.desc,
					lastModifiedBy: data.userId,
					updatedAt: new Date(),
				},
			}),
			prisma.tagAlias.deleteMany({
				where: { tagId: existing.id },
			}),
			prisma.tagAlias.createMany({
				data: data.aliases.map((name) => ({
					name,
					tagId: existing.id,
				})),
			}),
		]);

		const tag = await prisma.tag.findUnique({
			where: { id: existing.id },
			include,
		});
		if (tag) store(tag);
		return tag;
	},

	async delete(id: number): Promise<boolean> {
		const existing = await this.getById(id);
		if (!existing) return false;

		evict(existing);

		await prisma.tagAlias.deleteMany({ where: { tagId: id } });
		await prisma.tag.delete({ where: { id } });
		return true;
	},

	async incrementUses(id: number): Promise<void> {
		await prisma.tag.update({
			where: { id },
			data: { uses: { increment: 1 } },
		});

		const cached = BY_ID.get(id);
		if (cached) cached.uses += 1;
	},
	async getTopTags(limit: number): Promise<FullTag[]> {
		const tags = await prisma.tag.findMany({
			orderBy: { uses: "desc" },
			take: limit,
			include,
		});
		for (const tag of tags) {
			store(tag);
		}
		return tags;
	},
};
