import {
	type ChatInputCommandInteraction,
	Colors,
	ContainerBuilder,
	MessageFlags,
} from "discord.js";
import { ErrorMessages } from "@/error-messages/index.js";
import { getBotOption, setBotOption } from "@/options.js";
import { isStaff } from "@/util/permissions.js";
import { getCommandUser } from "@/util/user.js";

export const setOptionHandler = async (
	interaction: ChatInputCommandInteraction
) => {
	const commandUser = getCommandUser(interaction);
	if (!isStaff(commandUser)) {
		await interaction.reply({
			components: [ErrorMessages.User.MissingPermissions],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
	}

	const optionKey = interaction.options.getString(
		"option",
		true
	) as keyof typeof getBotOption;
	const value = interaction.options.getString("value", true);

	const option = getBotOption(optionKey);

	if (isInvalidOptionValue(option, value)) {
		await interaction.reply({
			components: [buildErrorMessage(optionKey, option.type)],
			flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
		});
		return;
	}

	await setBotOption(optionKey, value);

	await interaction.reply({
		components: [
			new ContainerBuilder().addTextDisplayComponents((c) =>
				c.setContent(`Set ${optionKey} to ${value}`)
			),
		],
		flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
	});
};

function buildErrorMessage(optionName: string, expectedType: string) {
	return new ContainerBuilder()
		.setAccentColor(Colors.Red)
		.addTextDisplayComponents((c) =>
			c.setContent(
				`Invalid value for option "${optionName}". Expected a ${expectedType}.`
			)
		);
}

function isInvalidOptionValue(
	option: ReturnType<typeof getBotOption>,
	value: string
) {
	if (option.type === "number") {
		return Number.isNaN(Number(value));
	}

	if (option.type === "boolean") {
		return !["true", "false"].includes(value);
	}

	return false;
}
