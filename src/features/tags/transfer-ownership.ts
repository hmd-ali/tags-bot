import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ErrorMessages } from "@/error-messages/index.js";
import {
	basicErrorMessage,
	basicMessage,
} from "@/util/components/basic-message.js";
import { getCommandUser } from "@/util/user.js";
import { canAccessTags, canModifyTag } from "./permissions.js";
import { TagsManager } from "./tag.js";

export const transferTagOwnership = async (
	interaction: ChatInputCommandInteraction
) => {
	const tagName = interaction.options.getString("name", true);
	const newOwner = interaction.options.getUser("new_owner", true);
	const commandUser = getCommandUser(interaction);

	if (!canAccessTags(commandUser)) {
		await interaction.reply({
			components: [ErrorMessages.Tags.MissingRole],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
		return;
	}

	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	const tag = await TagsManager.get(tagName);
	if (tag === null) {
		await interaction.editReply({
			components: [ErrorMessages.Tags.TagNotFound(tagName)],
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

	if (tag.userId === newOwner.id) {
		await interaction.editReply({
			components: [
				basicMessage(
					`Tag \`${tagName}\` is already owned by <@${newOwner.id}>.`
				),
			],
			allowedMentions: { parse: [] },
			flags: MessageFlags.IsComponentsV2,
		});
		return;
	}

	try {
		await TagsManager.update(tagName, { userId: newOwner.id });
		await interaction.editReply({
			components: [
				basicMessage(
					`Ownership of tag \`${tagName}\` has been transferred to <@${newOwner.id}>.`
				),
			],
			allowedMentions: { parse: [] },
			flags: MessageFlags.IsComponentsV2,
		});
	} catch (error) {
		console.error("Error transferring tag ownership:", error);
		await interaction.editReply({
			components: [
				basicErrorMessage(
					`An error occurred while transferring ownership of tag \`${tagName}\`.`
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
};
