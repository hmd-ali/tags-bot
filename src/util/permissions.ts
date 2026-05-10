import type { GuildMember } from "discord.js";
import { env } from "@/env.js";

export const isServerOwner = (member: GuildMember): boolean => {
	return member.guild.ownerId === member.id;
};

export const isModerator = (member: GuildMember): boolean => {
	const moderatorRole = member.guild.roles.cache.get(env.roles.moderator);
	if (moderatorRole === undefined) {
		throw new Error(
			"Moderator role not found in the guild. Please check the configuration."
		);
	}

	return member.roles.highest.position >= moderatorRole.position;
};

export const hasTagAccess = (member: GuildMember): boolean => {
	return member.roles.cache.has(env.roles.tagAccess);
};

export const isStaff = (member: GuildMember): boolean => {
	return isServerOwner(member) || isModerator(member);
};
