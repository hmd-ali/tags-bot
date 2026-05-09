import {
	type ChatInputCommandInteraction,
	GuildMember,
	LabelBuilder,
	MessageFlags,
	ModalBuilder,
	type ModalSubmitInteraction,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import { TagsCache } from "@/cache/tags.js";
import { prisma } from "@/db/prisma.js";
import { env } from "@/env.js";

export const editTagCommandHandler = async (
	interaction: ChatInputCommandInteraction
) => {
	const commandUser = interaction.member;
	if (!(commandUser instanceof GuildMember)) {
		await interaction.reply({
			content: "An error occurred while verifying your permissions.",
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const tagName = interaction.options.getString("name", true);

	const tag =
		TagsCache.get(tagName) ||
		(await prisma.tag.findUnique({ where: { name: tagName } }));

	if (tag === null) {
		await interaction.reply({
			content: `Tag \`${tagName}\` not found.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	TagsCache.set(tag);

	const moderatorRole = await commandUser.guild.roles.fetch(
		env.roles.moderator
	);

	const isServerOwner = commandUser.guild.ownerId === commandUser.id;
	const isModerator =
		moderatorRole !== null &&
		commandUser.roles.highest.position >= moderatorRole.position;
	const isTagOwner = tag.userId === commandUser.id;

	if (!isServerOwner && !isModerator && !isTagOwner) {
		await interaction.reply({
			content: `You do not own the tag \`${tagName}\`. Only the owner and moderators can edit the tag.`,
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const modal = new ModalBuilder()
		.setTitle(`Edit Tag: ${tagName}`)
		.setCustomId(`tags-edit-modal-${tagName}`)
		.addLabelComponents(
			new LabelBuilder()
				.setLabel("Content")
				.setDescription("The new content of the tag")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("content")
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
						.setValue(tag.content)
				),
			new LabelBuilder()
				.setLabel("Short Description")
				.setDescription("What is this tag about?")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("desc")
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
						.setValue(tag.desc)
				)
		);

	await interaction.showModal(modal);
	const submitted = await interaction.awaitModalSubmit({
		time: 60_000,
	});

	await modalHandler(submitted);
};

const modalHandler = async (interaction: ModalSubmitInteraction) => {
	const tagName = interaction.customId.replace("tags-edit-modal-", "");
	const newContent = interaction.fields.getTextInputValue("content");
	const newDesc = interaction.fields.getTextInputValue("desc");

	try {
		const updatedTag = await prisma.tag.update({
			where: { name: tagName },
			data: { content: newContent, desc: newDesc },
		});
		TagsCache.set(updatedTag);

		await interaction.reply({
			content: `Tag \`${tagName}\` has been updated.`,
			flags: MessageFlags.Ephemeral,
		});
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: `Failed to update tag \`${tagName}\`. It may have been deleted.`,
			flags: MessageFlags.Ephemeral,
		});
		TagsCache.delete(tagName);
	}
};
