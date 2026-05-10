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
import { TagsManager } from "./tag.js";

export const createTagCommandHandler = async (
	interaction: ChatInputCommandInteraction
) => {
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
		const name = interaction.fields.getTextInputValue("name");
		const content = interaction.fields.getTextInputValue("content");
		const desc = interaction.fields.getTextInputValue("desc");

		const userId = interaction.user.id;
		try {
			const existingTag = await TagsManager.get(name);
			if (existingTag !== null) {
				await interaction.reply({
					components: [ErrorMessages.Tags.TagAlreadyExists(name)],
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
			const tag = await TagsManager.create({ name, content, desc, userId });

			await interaction.reply({
				components: [basicMessage(`Tag created with name: \`${tag.name}\`.`)],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		} catch (error) {
			console.error(error);
			if (!interaction.replied) {
				await interaction.reply({
					components: [
						basicErrorMessage("An error occurred while creating the tag."),
					],
					flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
				});
			}
		}
	},
};
registerModalSubmitInteraction(submissionHandler);
