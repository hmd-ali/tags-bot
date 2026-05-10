import { ApplicationCommandOptionType } from "discord.js";
import { createSlashCommand } from "@/common/commands/create-commands.js";
import {
	type AutoCompleteSubmitInteraction,
	registerAutocompleteInteraction,
} from "@/common/interactions/autocomplete-interaction.js";
import { prisma } from "@/db/prisma.js";
import { getCommandUser, isModerator, isServerOwner } from "@/util/user.js";
import { changeTagsPrefix } from "./change-prefix.js";
import { checkTagOwner } from "./check-owner.js";
import { createTagCommandHandler } from "./create-tag.js";
import { currentPrefix } from "./current-prefix.js";
import { deleteTagCommandHandler } from "./delete-tag.js";
import { editTagCommandHandler } from "./edit-tag.js";
import { listTagsCommandHandler } from "./list-tags.js";
import { transferTagOwnership } from "./transfer-ownership.js";

export const tagCommand = createSlashCommand({
	data: {
		name: "tags",
		description: "Manage tags in the server",
		options: [
			{
				name: "create",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Create a new tag",
			},
			{
				name: "edit",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Edit an existing tag",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionType.String,
						description: "The name of the tag to edit",
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "list",
				type: ApplicationCommandOptionType.Subcommand,
				description: "List all tags in the server",
				options: [
					{
						name: "search",
						type: ApplicationCommandOptionType.String,
						description: "Search tags by name",
						required: false,
					},
				],
			},
			{
				name: "delete",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Delete an existing tag",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionType.String,
						description: "The name of the tag to delete",
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "owner",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Check the owner of a tag",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionType.String,
						description: "The name of the tag to check ownership for",
						required: true,
						autocomplete: true,
					},
				],
			},
			{
				name: "transfer",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Transfer ownership of a tag to another user",
				options: [
					{
						name: "name",
						type: ApplicationCommandOptionType.String,
						description: "The name of the tag to transfer ownership of",
						required: true,
						autocomplete: true,
					},
					{
						name: "new_owner",
						type: ApplicationCommandOptionType.User,
						description: "The new owner of the tag",
						required: true,
					},
				],
			},
			{
				name: "change-prefix",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Set the tag prefix for this server",
				options: [
					{
						name: "prefix",
						type: ApplicationCommandOptionType.String,
						description: "The new tag prefix (e.g. $)",
						required: true,
					},
				],
			},
			{
				name: "current-prefix",
				type: ApplicationCommandOptionType.Subcommand,
				description: "Check the current tag prefix for this server",
			},
		],
	},
	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();
		const handlersMap = {
			create: createTagCommandHandler,
			edit: editTagCommandHandler,
			list: listTagsCommandHandler,
			delete: deleteTagCommandHandler,
			"change-prefix": changeTagsPrefix,
			"current-prefix": currentPrefix,
			owner: checkTagOwner,
			transfer: transferTagOwnership,
		};

		if (subCommand in handlersMap) {
			await handlersMap[subCommand as keyof typeof handlersMap](interaction);
		}

		return;
	},
});

const autoCompleteHandler: AutoCompleteSubmitInteraction = {
	commandName: "tags",
	handler: async (interaction) => {
		const focusedOption = interaction.options.getFocused(true);
		if (focusedOption.name !== "name") {
			return;
		}
		const showOwnTags = ["edit", "delete", "transfer"].includes(
			interaction.options.getSubcommand()
		);
		const input = focusedOption.value;
		const commandUser = getCommandUser(interaction);
		const allTags = await prisma.tag.findMany({
			where: {
				name: { contains: input },
				userId: showOwnTags
					? isServerOwner(commandUser) || isModerator(commandUser)
						? undefined
						: commandUser.id
					: undefined,
			},
			take: 25,
		});
		const choices = allTags.map((tag) => ({
			name: tag.name,
			value: tag.name,
		}));

		await interaction.respond(choices);
	},
};
registerAutocompleteInteraction(autoCompleteHandler);
