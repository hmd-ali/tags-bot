import type { OptionKey } from '@generated/prisma/enums.js';
import {
  type ChatInputCommandInteraction,
  ContainerBuilder,
  MessageFlags,
} from 'discord.js';
import { getBotOption } from '@/options.js';

export const getOptionHandler = async (
  interaction: ChatInputCommandInteraction
) => {
  const optionKey = interaction.options.getString('option', true) as OptionKey;
  const option = getBotOption(optionKey);
  await interaction.reply({
    components: [
      new ContainerBuilder().addTextDisplayComponents((c) =>
        c.setContent(`**${option.displayName}**: ${option.value}`)
      ),
    ],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2,
  });
};
