import {
	type APIEmbedField,
	ComponentType,
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

type OriginalQuoteInfo = {
	authorMention: string;
	channelName: string;
	jumpLink: string;
};

// Captures the pieces of a line we previously generated:
// "<@quotedBy> quoted <@author> from **channel** [link ↗](<url>)"
// Used on both the V1 field value and the V2 text line (V2 has a "-# " prefix).
const QUOTE_LINE_CAPTURE_REGEX =
	/^(?:-#\s)?<@!?\d+>\squoted\s(<@!?\d+>)\sfrom\s\*\*(.+?)\*\*\s\[link ↗\]\(<(.+?)>\)$/;

const parseOriginalQuoteInfo = (text: string): OriginalQuoteInfo | null => {
	const match = QUOTE_LINE_CAPTURE_REGEX.exec(text);
	if (!match) return null;
	const [, authorMention, channelName, jumpLink] = match;
	return { authorMention, channelName, jumpLink };
};

const buildQuoteLine = (quotedBy: User, info: OriginalQuoteInfo): string =>
	truncate(
		`${quotedBy} quoted ${info.authorMention} from **${info.channelName}** [link ↗](<${info.jumpLink}>)`,
		FIELD_VALUE_LIMIT
	);

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

	// Default: quotedMessage is an original, non-quote message, so it *is*
	// the source of truth for author/channel/link.
	const freshInfo: OriginalQuoteInfo = {
		authorMention: `${quotedMessage.author}`,
		channelName,
		jumpLink: quotedMessage.url,
	};

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

		const existingLineIndex = components.findIndex(
			(c) => c.type === ComponentType.TextDisplay
		);
		const existingContent =
			existingLineIndex !== -1
				? (components[existingLineIndex] as { content: string }).content
				: null;

		// If quotedMessage is itself a quote, pull the *original* author/link
		// out of its attribution line instead of using quotedMessage's own
		// url/author — otherwise every re-quote would drift to point at the
		// previous requote instead of the true source.
		const originalInfo =
			existingContent !== null
				? (parseOriginalQuoteInfo(existingContent) ?? freshInfo)
				: freshInfo;

		const attributionLine = new TextDisplayBuilder()
			.setContent(`-# ${buildQuoteLine(quotedBy, originalInfo)}`)
			.toJSON();

		if (existingLineIndex !== -1) {
			components[existingLineIndex] = attributionLine;
		} else {
			components.push(attributionLine);
		}

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

	let embeds = quotedMessage.embeds
		.slice(0, 9) // leave room for our wrapper, max 10 embeds/message
		.map((e) => EmbedBuilder.from(e));

	// Find an existing "Quoted by" field, if quotedMessage is itself a quote.
	let existingField: APIEmbedField | null = null;
	for (const embed of embeds) {
		const found = embed.data.fields?.find(
			(f) => /^quoted by$/i.test(f.name) && parseOriginalQuoteInfo(f.value)
		);
		if (found) {
			existingField = found;
			break;
		}
	}

	const originalInfo = existingField
		? (parseOriginalQuoteInfo(existingField.value) as OriginalQuoteInfo)
		: freshInfo;

	const quotedByField: APIEmbedField = {
		name: "Quoted by",
		value: buildQuoteLine(quotedBy, originalInfo),
		inline: false,
	};

	if (existingField) {
		// Already a quote: swap the field's value in place, keep everything
		// else (original author/description/image/timestamp) untouched.
		existingField.value = quotedByField.value;
	} else {
		// First-time quote: build the wrapper/annotation as usual.
		const authorOptions = {
			name: quotedMessage.author.username,
			iconURL: quotedMessage.author.displayAvatarURL({ size: 64 }),
		};

		const stampAsQuote = (embed: EmbedBuilder) =>
			embed.setAuthor(authorOptions).addFields(quotedByField).setTimestamp();

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
			// No text, but the original had its own embed(s). Annotate the
			// first one instead of adding a redundant wrapper.
			embeds[0] = stampAsQuote(embeds[0]);
		} else {
			// No content, no embeds, just attachment(s). Attribution has to
			// live in its own small embed since there's nothing to annotate.
			embeds = [
				stampAsQuote(new EmbedBuilder()).setImage(firstImage?.url ?? null),
			];
		}
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
