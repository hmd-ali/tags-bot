import {
  Colors,
  ComponentBuilder,
  ContainerBuilder,
  InteractionReplyOptions,
  TextDisplayBuilder,
} from "discord.js";

export const basicMessage = (
  content: string,
): Required<InteractionReplyOptions>["components"][number] => {
  return new ContainerBuilder()
    .setAccentColor(Colors.Blue)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(content));
};
