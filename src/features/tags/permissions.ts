import type { GuildMember } from "discord.js";
import { hasTagAccess, isStaff } from "@/util/permissions.js";

export const canAccessTags = (member: GuildMember): boolean => {
	return isStaff(member) || hasTagAccess(member);
};

export const canModifyTag = (
	member: GuildMember,
	tagOwnerId: string
): boolean => {
	return isStaff(member) || (hasTagAccess(member) && member.id === tagOwnerId);
};
