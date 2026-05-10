import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { prisma } from "@/db/prisma.js";
import { ErrorMessages } from "@/error-messages/index.js";
import {
	basicErrorMessage,
	basicMessage,
} from "@/util/components/basic-message.js";
import { isStaff } from "@/util/permissions.js";
import { setTagPrefix } from "@/util/tag-prefix.js";
import { getCommandUser } from "@/util/user.js";

export const changeTagsPrefix = async (
	interaction: ChatInputCommandInteraction
) => {
	const commandUser = getCommandUser(interaction);
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });

	if (!isStaff(commandUser)) {
		await interaction.editReply({
			components: [ErrorMessages.Tags.MissingPermissions],
			flags: MessageFlags.IsComponentsV2,
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

		await interaction.editReply({
			components: [
				basicMessage(`Tag prefix has been set to \`${updated.value}\`.`),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	} catch (error) {
		console.error("Error updating tag prefix:", error);
		await interaction.editReply({
			components: [
				basicErrorMessage("An error occurred while updating the tag prefix."),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
};
