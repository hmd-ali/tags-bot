import { getTagPrefix } from "@/util/tag-prefix.js";
import { ChatInputCommandInteraction } from "discord.js";

export const currentPrefix = async (
  interaction: ChatInputCommandInteraction,
) => {
  const prefix = getTagPrefix();

  await interaction.reply({
    content: `The current tag prefix is \`${prefix}\`.`,
  });
};
