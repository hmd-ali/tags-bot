import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

export const checkTagOwner = async (
  interaction: ChatInputCommandInteraction,
) => {
  const name = interaction.options.getString("name", true);
  await interaction.reply({
    content: "Checking tag ownership...",
  });

  let tag =
    TagsCache.get(name) ||
    (await prisma.tag.findUnique({ where: { name: name } }));

  if (tag === null) {
    await interaction.reply({
      content: `Tag \`${name}\` not found.`,
    });
    return null;
  }
  TagsCache.set(tag);
  await interaction.editReply({
    content: `Tag \`${name}\` is owned by <@${tag.userId}>.`,
    allowedMentions: { parse: [] },
  });
  return tag.userId;
};
