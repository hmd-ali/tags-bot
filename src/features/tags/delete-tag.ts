import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ErrorMessages } from "@/error-messages/index.js";
import {
	basicErrorMessage,
	basicMessage,
} from "@/util/components/basic-message.js";
import { getCommandUser } from "@/util/user.js";
import { canAccessTags, canModifyTag } from "./permissions.js";
import { TagService } from "./tag-service.js";

export const deleteTagCommandHandler = async (
	interaction: ChatInputCommandInteraction
) => {
	const name = interaction.options.getString("name", true);

	const commandUser = getCommandUser(interaction);

	if (!canAccessTags(commandUser)) {
		await interaction.reply({
			components: [ErrorMessages.Tags.MissingRole],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
		return;
	}

	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	const tag = await TagService.getByName(name);
	if (tag === null) {
		await interaction.editReply({
			components: [ErrorMessages.Tags.TagNotFound(name)],
			flags: MessageFlags.IsComponentsV2,
		});
		return;
	}

	if (!canModifyTag(commandUser, tag.userId)) {
		await interaction.editReply({
			components: [ErrorMessages.Tags.OwnershipRequired],
			flags: MessageFlags.IsComponentsV2,
		});
		return;
	}

	try {
		await TagService.delete(tag.id);
		await interaction.editReply({
			components: [basicMessage(`Tag \`${name}\` has been deleted.`)],
			flags: MessageFlags.IsComponentsV2,
		});
	} catch (error) {
		console.error("Error deleting tag:", error);
		if (!interaction.replied) {
			await interaction.editReply({
				components: [
					basicErrorMessage("An error occurred while deleting the tag."),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		}
	}
};
