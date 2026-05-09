import { type ChatInputCommandInteraction, GuildMember } from "discord.js";
import { env } from "@/env.js";

export const getCommandUser = (
	interaction: ChatInputCommandInteraction
): GuildMember | null => {
	const commandUser = interaction.member;
	if (!(commandUser instanceof GuildMember)) {
		return null;
	}
	return commandUser;
};

export const isServerOwner = (member: GuildMember): boolean => {
	return member.guild.ownerId === member.id;
};

export const isModerator = async (member: GuildMember) => {
	const moderatorRole =
		member.guild.roles.cache.get(env.roles.moderator) ||
		(await member.guild.roles.fetch(env.roles.moderator));

	return (
		moderatorRole !== null &&
		member.roles.highest.position >= moderatorRole.position
	);
};
