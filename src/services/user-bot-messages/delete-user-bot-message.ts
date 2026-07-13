import type { GuildMember } from "discord.js";
import { prisma } from "@/db/prisma.js";
import { isStaff } from "@/util/permissions.js";

export const deleteUserBotMessage = async ({
	messageId,
	user,
}: {
	messageId: string;
	user: GuildMember;
}) => {
	const message = await prisma.userBotMessages.findUnique({
		where: { id: messageId },
	});

	if (message === null) {
		return false;
	}

	if (message.userId !== user.id && !isStaff(user)) {
		return false;
	}

	try {
		await prisma.userBotMessages.delete({ where: { id: messageId } });
		return true;
	} catch {
		return false;
	}
};
