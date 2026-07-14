import { Events } from 'discord.js';
import { createEvent } from '@/common/events/create-event.js';
import { removeUserBotMessage } from './handlers/remove-user-bot-message.js';

const handlers = [removeUserBotMessage];

export const reactionAddEvent = createEvent(
  {
    name: Events.MessageReactionAdd,
  },
  async (reaction, user, details) => {
    if (user.bot) {
      return;
    }
    try {
      if (reaction.partial) {
        await reaction.fetch();
      }
    } catch {
      return;
    }

    for (const handler of handlers) {
      await handler(reaction, user, details);
    }
  }
);
