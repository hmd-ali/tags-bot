import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { prisma } from "@/db/prisma.js";
import { TagsCache } from "@/cache/tags.js";
import { getCommandUser, isModerator, isServerOwner } from "@/util/user.js";
import { TagsManager } from "./tag.js";
import { ErrorMessages } from "@/error-messages/index.js";

export const deleteTagCommandHandler = async (
  interaction: ChatInputCommandInteraction,
) => {
  const name = interaction.options.getString("name", true);

  const commandUser = getCommandUser(interaction);
  if (commandUser === null) {
    await interaction.reply(ErrorMessages.User.UnableToVerifyPermissions);
    return;
  }
  const tag = await TagsManager.get(name);
  if (tag === null) {
    await interaction.reply(ErrorMessages.Tags.TagNotFound(name));
    return;
  }

  const isTagOwner = tag.userId === commandUser.id;
  const isUserModerator = await isModerator(commandUser);

  if (!isServerOwner(commandUser) && !isUserModerator && !isTagOwner) {
    await interaction.reply(ErrorMessages.Tags.OwnershipRequired);
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
