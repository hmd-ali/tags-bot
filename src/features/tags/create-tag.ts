import { Prisma } from "@generated/prisma/client.js";
import {
	type ChatInputCommandInteraction,
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import {
	type ModalSubmitInteraction,
	registerModalSubmitInteraction,
} from "@/common/interactions/modal-interaction.js";
import { ErrorMessages } from "@/error-messages/index.js";
import {
	basicErrorMessage,
	basicMessage,
} from "@/util/components/basic-message.js";
import { customId } from "@/util/custom-id.js";
import { getCommandUser } from "@/util/user.js";
import { isValidTagName } from "@/util/validate-tag-name.js";
import { canAccessTags } from "./permissions.js";
import { TagsManager } from "./tag.js";

export const createTagCommandHandler = async (
	interaction: ChatInputCommandInteraction
) => {
	const commandUser = getCommandUser(interaction);
	if (!canAccessTags(commandUser)) {
		await interaction.reply({
			components: [ErrorMessages.Tags.MissingRole],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
		return;
	}

	const modal = new ModalBuilder()
		.setCustomId(customId("create-tag", interaction.user.id, Date.now()))
		.setTitle("Create Tag")
		.addLabelComponents(
			new LabelBuilder()
				.setLabel("Name")
				.setDescription("The name of the tag")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("name")
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
				),
			new LabelBuilder()
				.setLabel("Short Description")
				.setDescription("What is this tag about?")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("desc")
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
				),
			new LabelBuilder()
				.setLabel("Content")
				.setDescription("The content of the tag")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("content")
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
				)
		);
	await interaction.showModal(modal);
};

const submissionHandler: ModalSubmitInteraction = {
	commandName: "create-tag",
	handler: async (interaction) => {
		const commandUser = getCommandUser(interaction);
		if (!canAccessTags(commandUser)) {
			await interaction.reply({
				components: [ErrorMessages.Tags.MissingRole],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
			return;
		}

		const name = interaction.fields.getTextInputValue("name");
		const content = interaction.fields.getTextInputValue("content");
		const desc = interaction.fields.getTextInputValue("desc");

		if (!isValidTagName(name)) {
			await interaction.reply({
				components: [ErrorMessages.Tags.InvalidTagName],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
			return;
		}

		const userId = interaction.user.id;
		try {
			const tag = await TagsManager.create({ name, content, desc, userId });

			await interaction.reply({
				components: [basicMessage(`Tag created with name: \`${tag.name}\`.`)],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					await interaction.reply({
						components: [ErrorMessages.Tags.TagAlreadyExists(name)],
						flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
					});
					return;
				}
			}
		}
	},
};
registerModalSubmitInteraction(submissionHandler);
