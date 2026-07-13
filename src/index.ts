import { Client, GatewayIntentBits } from "discord.js";
import { loadEvents } from "@/common/events/load-events.js";
import { prisma } from "@/db/prisma.js";
import { env } from "@/env.js";
import { initBotOptions } from "./options.js";

const client = new Client({
	intents:
		GatewayIntentBits.Guilds |
		GatewayIntentBits.GuildMessages |
		GatewayIntentBits.MessageContent,
});

loadEvents(client);

client.login(env.discord.token);
await initBotOptions();

process.on("SIGINT", async () => {
	await prisma.$disconnect();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	await prisma.$disconnect();
	process.exit(0);
});
