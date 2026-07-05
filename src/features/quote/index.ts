import { Events, type Message } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { createQuoteEmbed } from "./embed.js";

export const quoteReceived = createEvent(
	{
		name: Events.MessageCreate,
	},
	async (messageWithLinks) => {
		if (messageWithLinks.system || messageWithLinks.author.bot) return;
		const guildId = messageWithLinks.guildId;

		const messageLinkRegex = new RegExp(
			`https:\\/\\/discord\\.com\\/channels\\/${guildId}\\/(\\d+)\\/(\\d+)`,
			"g"
		);

		const quotedMessageLinks = Array.from(
			messageWithLinks.content.matchAll(messageLinkRegex)
		);

		if (quotedMessageLinks.length === 0) return;

		const getMessage = async (channelId: string, messageId: string) => {
			const channel = await messageWithLinks.client.channels.fetch(channelId);
			if (!channel?.isTextBased() || channel.isDMBased()) return null;
			try {
				const quotedMessage = await channel.messages.fetch(messageId);
				return quotedMessage;
			} catch {
				return null;
			}
		};

		const quotedMessages = await Promise.allSettled(
			quotedMessageLinks.map((match) => getMessage(match[1], match[2]))
		);
		const validQuotedMessages = quotedMessages.reduce<Message<true>[]>(
			(acc, result) => {
				if (result.status === "fulfilled" && result.value !== null) {
					acc.push(result.value);
				}
				return acc;
			},
			[]
		);
		messageWithLinks.content = messageWithLinks.content
			.replace(messageLinkRegex, "")
			.trim();
		const isLinksOnly = messageWithLinks.content.length === 0;
		const shouldDelete = isLinksOnly && validQuotedMessages.length > 0;
		if (shouldDelete) {
			try {
				void messageWithLinks.delete();
			} catch {}
		}

		const channel = messageWithLinks.channel;
		await Promise.all(
			validQuotedMessages.map((quotedMessage, index) =>
				channel.send(
					createQuoteEmbed({
						quotedMessage,
						quotedBy: messageWithLinks.author,
						referenceMessageId:
							index === 0
								? messageWithLinks.reference?.messageId ||
									(shouldDelete ? undefined : messageWithLinks.id)
								: undefined,
					})
				)
			)
		);
		return;
	}
);
