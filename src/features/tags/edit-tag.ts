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
import { customId, parseCustomId } from "@/util/custom-id.js";
import { getCommandUser } from "@/util/user.js";
import { isValidTagName } from "@/util/validate-tag-name.js";
import { canAccessTags, canModifyTag } from "./permissions.js";
import { TagsManager } from "./tag.js";

const BASE_NAME = "tags-edit";

export const editTagCommandHandler = async (
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

	const name = interaction.options.getString("name", true);

	const tag = await TagsManager.get(name);
	if (tag === null) {
		await interaction.reply({
			components: [ErrorMessages.Tags.TagNotFound(name)],
			flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
		});
		return;
	}

	if (!canModifyTag(commandUser, tag.userId)) {
		await interaction.reply({
			components: [ErrorMessages.Tags.OwnershipRequired],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
		return;
	}

	const modal = new ModalBuilder()
		.setTitle(`Edit Tag: ${name}`)
		.setCustomId(customId(BASE_NAME, name))
		.addLabelComponents(
			new LabelBuilder()
				.setLabel("Name")
				.setDescription("The name of the tag")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("name")
						.setStyle(TextInputStyle.Short)
						.setRequired(true)
						.setValue(tag.name)
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
				),
			new LabelBuilder()
				.setLabel("Content")
				.setDescription("The new content of the tag")
				.setTextInputComponent(
					new TextInputBuilder()
						.setCustomId("content")
						.setStyle(TextInputStyle.Paragraph)
						.setRequired(true)
						.setValue(tag.content)
				)
		);

	await interaction.showModal(modal);
};

const modalHandler: ModalSubmitInteraction = {
	commandName: BASE_NAME,
	handler: async (interaction) => {
		const commandUser = getCommandUser(interaction);
		const [_, tagName] = parseCustomId(interaction.customId);
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

		const tag = await TagsManager.get(tagName);
		if (tag === null || !canModifyTag(commandUser, tag.userId)) {
			await interaction.reply({
				components: [ErrorMessages.Tags.OwnershipRequired],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
			return;
		}

		try {
			await TagsManager.update(tagName, {
				name,
				content,
				desc,
			});

			const message =
				tagName === name
					? `Tag \`${name}\` has been updated.`
					: `Tag \`${tagName}\` has been updated and renamed to \`${name}\`.`;

			await interaction.reply({
				components: [basicMessage(message)],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		} catch (error) {
			console.error(error);
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				await interaction.reply({
					components: [ErrorMessages.Tags.TagAlreadyExists(name)],
					flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
				});
				return;
			}
			await interaction.reply({
				components: [
					basicErrorMessage(
						`Failed to update tag \`${tagName}\`. It may have been deleted.`
					),
				],
				flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
			});
		}
	},
};
registerModalSubmitInteraction(modalHandler);
