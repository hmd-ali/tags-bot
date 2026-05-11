import { Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { prisma } from "@/db/prisma.js";
import { setTagPrefix } from "@/util/tag-prefix.js";

export const readyEvent = createEvent(
	{
		name: Events.ClientReady,
		once: true,
	},
	async (client) => {
		console.log(`Logged in as ${client.user.tag}`);
		try {
			const tagPrefixOption = await prisma.options.findUnique({
				where: { key: "tag_prefix" },
			});
			if (tagPrefixOption !== null) {
				setTagPrefix(tagPrefixOption.value);
			}
		} catch (error) {
			console.error(
				"Something went wrong while fetching tag prefix from the database:",
				error
			);
		}
	}
);
