import { Colors, ContainerBuilder, Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";
import { getTagPrefix } from "@/util/tag-prefix.js";

export const tagReceivedEvent = createEvent(
  {
    name: Events.MessageCreate,
  },
  async (message) => {
    const prefix = getTagPrefix();
    const tagRegex = new RegExp(
      `(?:^|\\s)${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([a-zA-Z][\\w-]*)`,
    );
    const match = message.content.match(tagRegex);
    if (!match) return;

    const tagName = match[1];
    let tag = TagsCache.get(tagName) ?? null;

    if (!tag) {
      tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) {
        return;
      }
      TagsCache.set(tag);
    }

    prisma.tag
      .update({
        where: { name: tagName },
        data: { uses: { increment: 1 } },
      })
      .catch(console.error);

    TagsCache.set({ ...tag, uses: tag.uses + 1 });

    await message.reply({
      content: tag.content,
      allowedMentions: { parse: [] },
    });
  },
);
