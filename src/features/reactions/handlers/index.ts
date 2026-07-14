import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';

export type ReactionAddEvent = {
  reaction: MessageReaction | PartialMessageReaction;
  user: User | PartialUser;
};
