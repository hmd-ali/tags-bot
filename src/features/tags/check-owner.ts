import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ErrorMessages } from "@/error-messages/index.js";
import { basicMessage } from "@/util/components/basic-message.js";
import { TagsManager } from "./tag.js";

export const checkTagOwner = async (
	interaction: ChatInputCommandInteraction
) => {
	const name = interaction.options.getString("name", true);
	await interaction.deferReply();

	const tag = await TagsManager.get(name);
	if (tag === null) {
		await interaction.editReply({
			components: [ErrorMessages.Tags.TagNotFound(name)],
			flags: MessageFlags.IsComponentsV2,
		});
		return;
	}
	await interaction.editReply({
		components: [basicMessage(`Tag \`${name}\` is owned by <@${tag.userId}>.`)],
		flags: MessageFlags.IsComponentsV2,
		allowedMentions: { parse: [] },
	});
	return;
};
