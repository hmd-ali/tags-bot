import type { ChatInputCommandInteraction } from "discord.js";
import { getTagPrefix } from "@/util/tag-prefix.js";

export const currentPrefix = async (
	interaction: ChatInputCommandInteraction
) => {
	const prefix = getTagPrefix();

	await interaction.reply({
		content: `The current tag prefix is \`${prefix}\`.`,
	});
};
