import { ApplicationCommandOptionType } from "discord.js";
import { createSlashCommand } from "@/common/commands/create-commands.js";
import { createTagCommandHandler } from "./create-tag.js";
import { editTagCommandHandler } from "./edit-tag.js";
import { listTagsCommandHandler } from "./list-tags.js";
import { deleteTagCommandHandler } from "./delete-tag.js";
import { changeTagsPrefix } from "./change-prefix.js";
import { checkTagOwner } from "./check-owner.js";
import { transferTagOwnership } from "./transfer-ownership.js";
import { currentPrefix } from "./current-prefix.js";

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
