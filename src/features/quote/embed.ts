import {
	type APIEmbedField,
	EmbedBuilder,
	type Message,
	type MessageCreateOptions,
	MessageFlags,
	TextDisplayBuilder,
	type User,
} from "discord.js";
import { truncate } from "@/util/truncate.js";

const EMBED_DESC_LIMIT = 4096;
const FIELD_VALUE_LIMIT = 1024;

export const createQuoteEmbed = ({
	quotedMessage,
	quotedBy,
	referenceMessageId,
}: {
	quotedMessage: Message;
	quotedBy: User;
	referenceMessageId?: string;
}): MessageCreateOptions => {
	const channelName = !quotedMessage.channel.isDMBased()
		? quotedMessage.channel.name
		: "Direct Message";

	const jumpLink = `[link ↗](<${quotedMessage.url}>)`;
	const quotedByLine = truncate(
		`${quotedBy} quoted ${quotedMessage.author} from **${channelName}** ${jumpLink}`,
		FIELD_VALUE_LIMIT
	);

	const reply = referenceMessageId
		? { messageReference: referenceMessageId }
		: undefined;

	const isV2 = quotedMessage.flags.has(MessageFlags.IsComponentsV2);

	// Case 1: Components V2 message
	// Can't mix with embeds/content at all. Just forward the components and
	// append a small text line for attribution.
	// Caveat: any component media using `attachment://filename` refs will break,
	// since we aren't re-uploading the original files under those names. Only
	// components pointing at real CDN urls survive the requote intact.
	if (isV2) {
		const components = quotedMessage.components.map((c) => c.toJSON());
		components.push(
			new TextDisplayBuilder().setContent(`-# ${quotedByLine}`).toJSON()
		);
		return {
			allowedMentions: { parse: [] },
			components,
			flags: MessageFlags.IsComponentsV2,
			reply,
		};
	}

	// Case 2: Normal (V1) message
	const attachmentUrls = quotedMessage.attachments.map((a) => a.url);
	const firstImage = quotedMessage.attachments.find((a) =>
		a.contentType?.startsWith("image/")
	);

	const quotedByField: APIEmbedField = {
		name: "Quoted by",
		value: quotedByLine,
		inline: false,
	};

	// Shared across all three embed-building paths below
	const authorOptions = {
		name: quotedMessage.author.username,
		iconURL: quotedMessage.author.displayAvatarURL({ size: 64 }),
	};

	const stampAsQuote = (embed: EmbedBuilder) =>
		embed.setAuthor(authorOptions).addFields(quotedByField).setTimestamp();

	let embeds = quotedMessage.embeds
		.slice(0, 9) // leave room for our wrapper, max 10 embeds/message
		.map((e) => EmbedBuilder.from(e));

	const hasContent = quotedMessage.content.length > 0;
	const hasEmbeds = embeds.length > 0;
	const hasAttachments = attachmentUrls.length > 0;
	const hasStickers = quotedMessage.stickers.size > 0;

	if (hasContent || (!hasEmbeds && !hasAttachments && !hasStickers)) {
		// Text present, OR message is genuinely empty (edge case). Build a
		// wrapper embed so we always have something valid to send.
		const wrapper = stampAsQuote(new EmbedBuilder()).setDescription(
			hasContent
				? truncate(quotedMessage.content, EMBED_DESC_LIMIT)
				: hasStickers
					? "*sent a sticker*"
					: null
		);
		if (firstImage) wrapper.setImage(firstImage.url);
		embeds = [wrapper, ...embeds];
	} else if (hasEmbeds) {
		// No text, but the original had its own embed(s). Annotate the first
		// one instead of adding a redundant wrapper.
		embeds[0] = stampAsQuote(embeds[0]);
	} else {
		// No content, no embeds, just attachment(s). Attribution has to live
		// in its own small embed since there's nothing to annotate.
		embeds = [
			stampAsQuote(new EmbedBuilder()).setImage(firstImage?.url ?? null),
		];
	}

	// Don't re-send the image we already used as the embed's setImage,
	// otherwise it shows up twice.
	const filesToSend = firstImage
		? attachmentUrls.filter((url) => url !== firstImage.url)
		: attachmentUrls;

	return {
		allowedMentions: { parse: [] },
		embeds: embeds.length > 0 ? embeds : undefined,
		files: filesToSend.length > 0 ? filesToSend : undefined,
		reply,
	};
};
