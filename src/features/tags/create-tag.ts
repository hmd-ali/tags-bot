import {
	type ChatInputCommandInteraction,
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	type ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";
import { customId } from "@/util/custom-id.js";

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
	try {
		const submittedInteraction = await interaction.awaitModalSubmit({
			time: 60_000,
			filter: (i) =>
				i.customId === modal.data.custom_id &&
				i.user.id === interaction.user.id,
		});
		await submissionHandler(submittedInteraction);
	} catch (error) {
		console.error(error);
	}
};

const submissionHandler = async (interaction: ModalSubmitInteraction) => {
	const name = interaction.fields.getTextInputValue("name");
	const content = interaction.fields.getTextInputValue("content");
	const desc = interaction.fields.getTextInputValue("desc");

	const userId = interaction.user.id;
	try {
		const existingTag =
			TagsCache.get(name) || (await prisma.tag.findUnique({ where: { name } }));
		if (existingTag) {
			await interaction.reply({
				content: `A tag with the name \`${name}\` already exists. Please choose a different name.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}
		const tag = await prisma.tag.create({
			data: {
				name,
				content,
				userId,
				desc,
			},
		});
		TagsCache.set(tag);

		await interaction.reply({
			content: `Tag created with name: \`${name}\`.`,
			flags: MessageFlags.Ephemeral,
		});
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "An error occurred while creating the tag.",
			flags: MessageFlags.Ephemeral,
		});
	}
};
