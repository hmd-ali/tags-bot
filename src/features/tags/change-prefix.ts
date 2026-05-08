import { prisma } from "@/db/prisma.js";
import { env } from "@/env.js";
import { setTagPrefix } from "@/util/tag-prefix.js";
import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
} from "discord.js";

export const changeTagsPrefix = async (
  interaction: ChatInputCommandInteraction,
) => {
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

  if (!isServerOwner && !isModerator) {
    await interaction.reply({
      content: "Only server owners and moderators can change the tag prefix.",
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const newPrefix = interaction.options.getString("prefix", true);

  try {
    const updated = await prisma.options.upsert({
      where: { key: "tag_prefix" },
      update: { value: newPrefix },
      create: { key: "tag_prefix", value: newPrefix },
    });
    setTagPrefix(updated.value);

    await interaction.reply({
      content: `Tag prefix has been set to \`${updated.value}\`.`,
    });
  } catch {
    await interaction.reply({
      content: "An error occurred while setting the tag prefix.",
      flags: MessageFlags.Ephemeral,
    });
  }
};
