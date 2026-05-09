import {
	Colors,
	ContainerBuilder,
	type InteractionReplyOptions,
	MessageFlags,
	TextDisplayBuilder,
} from "discord.js";

export const User = {
	UnableToVerifyPermissions: {
		components: [
			new ContainerBuilder()
				.setAccentColor(Colors.Red)
				.addTextDisplayComponents(
					new TextDisplayBuilder().setContent(
						"An error occurred while verifying your permissions."
					)
				),
		],
		flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
	} satisfies InteractionReplyOptions,
};
