import { Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { prisma } from "@/db/prisma.js";
import { env } from "@/env.js";
import { setTagPrefix } from "@/util/tag-prefix.js";

export const readyEvent = createEvent(
	{
		name: Events.ClientReady,
		once: true,
	},
	async (client) => {
		console.log(`Logged in as ${client.user.tag}`);

		try {
			console.log("Fetching moderator role and tag access role...");
			const guild = await client.guilds.fetch(env.discord.serverId);
			await Promise.all([
				guild.roles.fetch(env.roles.moderator),
				guild.roles.fetch(env.roles.tagAccess),
			]);
			console.log("Successfully fetched moderator role and tag access role.");
		} catch (error) {
			console.error(
				"Something went wrong while fetching moderator role and tag access role:",
				error
			);
		}

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
