import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { loadEvents } from '@/common/events/load-events.js';
import { prisma } from '@/db/prisma.js';
import { env } from '@/env.js';
import { initBotOptions } from './options.js';

const client = new Client({
  intents:
    GatewayIntentBits.Guilds |
    GatewayIntentBits.GuildMessages |
    GatewayIntentBits.GuildMessageReactions |
    GatewayIntentBits.MessageContent,
  partials: [
    Partials.GuildMember,
    Partials.Reaction,
    Partials.Message,
    Partials.User,
  ],
});

loadEvents(client);

void client.login(env.discord.token);
await initBotOptions();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
