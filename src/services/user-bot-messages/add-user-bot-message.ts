import { prisma } from "@/db/prisma.js";

export const addUserBotMessage = async ({
	userId,
	messageId,
	channelId,
}: {
	userId: string;
	messageId: string;
	channelId: string;
}) => {
	try {
		await prisma.userBotMessages.create({
			data: {
				channelId,
				id: messageId,
				userId,
			},
		});
	} catch {}
};
