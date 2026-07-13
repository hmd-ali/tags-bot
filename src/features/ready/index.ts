import { Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";

export const readyEvent = createEvent(
	{
		name: Events.ClientReady,
		once: true,
	},
	async (client) => {
		console.log(`Logged in as ${client.user.tag}`);
	}
);
