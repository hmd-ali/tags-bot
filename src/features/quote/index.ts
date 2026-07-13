import { Events, type Message } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { addUserBotMessage } from "@/services/user-bot-messages/add-user-bot-message.js";
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

		const embedOptions = validQuotedMessages.map((quotedMessage) =>
			createQuoteEmbed({ quotedMessage, quotedBy: messageWithLinks.author })
		);

		const renderableEmbeds = embedOptions.flatMap((e) =>
			e !== null ? [e] : []
		);
		const shouldDelete = isLinksOnly && renderableEmbeds.length > 0;

		if (shouldDelete) {
			try {
				void messageWithLinks.delete();
			} catch {}
		}

		if (renderableEmbeds.length === 0) return;

		const referenceMessageId =
			messageWithLinks.reference?.messageId ||
			(shouldDelete ? undefined : messageWithLinks.id);

		const channel = messageWithLinks.channel;
		await Promise.all(
			renderableEmbeds.map(async (options, i) => {
				const sentMessage = await channel.send(
					i === 0 && referenceMessageId
						? { ...options, reply: { messageReference: referenceMessageId } }
						: options
				);
				void addUserBotMessage({
					messageId: sentMessage.id,
					userId: messageWithLinks.author.id,
					channelId: messageWithLinks.channel.id,
				});
			})
		);
		return;
	}
);
