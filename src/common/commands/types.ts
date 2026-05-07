import type {
  ApplicationCommandType,
  ButtonInteraction,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  RESTPostAPIContextMenuApplicationCommandsJSONBody,
  UserContextMenuCommandInteraction,
} from "discord.js";

export type UserContextMenuCommand = {
  commandType: ApplicationCommandType.User;
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  execute: (
    interaction: UserContextMenuCommandInteraction,
  ) => Promise<void> | void;
};

export type MessageContextMenuCommand = {
  commandType: ApplicationCommandType.Message;
  data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
  execute: (
    interaction: MessageContextMenuCommandInteraction,
  ) => Promise<void> | void;
};

export type SlashCommand = {
  commandType: ApplicationCommandType.ChatInput;
  data: RESTPostAPIChatInputApplicationCommandsJSONBody;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  buttonCommands?: Array<
    (interaction: ButtonInteraction) => Promise<void> | void
  >;
};

export type Command =
  | SlashCommand
  | UserContextMenuCommand
  | MessageContextMenuCommand;

export type CommandInteraction =
  | ChatInputCommandInteraction
  | MessageContextMenuCommandInteraction
  | UserContextMenuCommandInteraction;
