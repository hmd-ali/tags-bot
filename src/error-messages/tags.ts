import {
  Colors,
  ContainerBuilder,
  InteractionReplyOptions,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";

export const Tags = {
  TagNotFound: (name: string): InteractionReplyOptions => ({
    components: [
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`Tag \`${name}\` not found.`),
        ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  }),
  TagAlreadyExists: (name: string): InteractionReplyOptions => ({
    components: [
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `Tag \`${name}\` already exists.`,
          ),
        ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  }),
  MissingRole: {
    components: [
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "You do not have the required role to use this command.",
          ),
        ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  } satisfies InteractionReplyOptions,
  MissingPermissions: {
    components: [
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "You do not have the required permissions to use this command.",
          ),
        ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  } satisfies InteractionReplyOptions,
  OwnershipRequired: {
    components: [
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            "You must be the owner of this tag to use this command.",
          ),
        ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  } satisfies InteractionReplyOptions,
};
