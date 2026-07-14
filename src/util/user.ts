import { type BaseInteraction, GuildMember } from 'discord.js';

export const getCommandUser = (interaction: BaseInteraction): GuildMember => {
  const commandUser = interaction.member;
  if (commandUser instanceof GuildMember) {
    return commandUser;
  }
  throw new Error(
    'Command user is not a GuildMember. This should never happen since commands can only be used in guilds.'
  );
};
