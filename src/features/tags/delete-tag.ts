import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { prisma } from "@/db/prisma.js";
import { TagsCache } from "@/cache/tags.js";
import { env } from "@/env.js";

export const deleteTagCommandHandler = async (
  interaction: ChatInputCommandInteraction,
) => {
  const name = interaction.options.getString("name", true);
  const commandUser = interaction.member;
  if (!(commandUser instanceof GuildMember)) {
    await interaction.reply({
      content: "An error occurred while verifying your permissions.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }
  const moderatorRole = await commandUser.guild.roles.fetch(
    env.roles.moderator,
  );
  const isServerOwner = commandUser.guild.ownerId === commandUser.id;
  const isModerator =
    moderatorRole !== null &&
    commandUser.roles.highest.position >= moderatorRole.position;

  const tag =
    TagsCache.get(name) || (await prisma.tag.findUnique({ where: { name } }));

  if (tag === null) {
    await interaction.reply({
      content: `Tag \`${name}\` not found.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const isTagOwner = tag.userId === commandUser.id;

  if (!isServerOwner && !isModerator && !isTagOwner) {
    await interaction.reply({
      content: `You do not own the tag \`${name}\`. Only the owner and moderators can edit the tag.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  await prisma.tag.delete({
    where: { name },
  });
  TagsCache.delete(name);

  await interaction.reply({
    content: `Tag \`${name}\` has been deleted.`,
    flags: MessageFlags.Ephemeral,
  });
};
