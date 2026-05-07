import { prisma } from "@/db/prisma.js";
import { setTagPrefix } from "@/util/tag-prefix.js";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

export const changeTagsPrefix = async (
  interaction: ChatInputCommandInteraction,
) => {
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
