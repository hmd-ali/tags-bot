import { type BaseInteraction, GuildMember } from "discord.js";
import { env } from "@/env.js";

export const getCommandUser = (interaction: BaseInteraction): GuildMember => {
	const commandUser = interaction.member;
	if (commandUser instanceof GuildMember) {
		return commandUser;
	}
	throw new Error(
		"Command user is not a GuildMember. This should never happen since commands can only be used in guilds."
	);
};

export const isServerOwner = (member: GuildMember): boolean => {
	return member.guild.ownerId === member.id;
};

export const isModerator = (member: GuildMember) => {
	const moderatorRole = member.guild.roles.cache.get(env.roles.moderator);
	if (moderatorRole === undefined) {
		throw new Error(
			"Moderator role not found in the guild. Please check the configuration."
		);
	}

	return member.roles.highest.position >= moderatorRole.position;
};
