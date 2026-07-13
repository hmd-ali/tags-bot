import { prisma } from "@/db/prisma.js";

const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // every hour

export const startExpiredMessageCleanup = () => {
	const cleanup = async () => {
		const { count } = await prisma.userBotMessages.deleteMany({
			where: { expiresAt: { lte: new Date() } },
		});
		if (count > 0) {
			console.log(`Cleaned up ${count} expired user bot messages.`);
		}
	};

	cleanup();
	setInterval(cleanup, CLEANUP_INTERVAL_MS);
};
