import { Events } from 'discord.js';
import { createEvent } from '@/common/events/create-event.js';
import { UserBotMessagesService } from '@/services/user-bot-messages/user-bot-messages-service.js';

export const readyEvent = createEvent(
  {
    name: Events.ClientReady,
    once: true,
  },
  async (client) => {
    void UserBotMessagesService.startExpiredMessageCleanup();
    console.log(`Logged in as ${client.user.tag}`);
  }
);
