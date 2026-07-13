import { Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { startExpiredMessageCleanup } from "@/services/user-bot-messages/cleanup.js";

export const readyEvent = createEvent(
	{
		name: Events.ClientReady,
		once: true,
	},
	async (client) => {
		startExpiredMessageCleanup();
		console.log(`Logged in as ${client.user.tag}`);
	}
);
