import { OptionKey } from "@generated/prisma/enums.js";
import { Events, type MessageCreateOptions } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { getBotOption } from "@/options.js";
import { stripAllCode } from "@/util/strip-code.js";
import { TagService } from "./tag-service.js";

export const tagReceivedEvent = createEvent(
	{
		name: Events.MessageCreate,
	},
	async (message) => {
		if (message.author.bot || message.author.system) return;

		const prefix = getBotOption(OptionKey.TAG_PREFIX).value;
		const tagRegex = new RegExp(
			`(?:^|\\s)${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([a-zA-Z][\\w-]*)`
		);
		const stripped = stripAllCode(message.content);
		const match = stripped.match(tagRegex);
		if (!match) return;

		const tagName = match[1];
		const tag = await TagService.getByName(tagName);
		if (tag === null) return;

		TagService.incrementUses(tag.id);

		const options: MessageCreateOptions = {
			content: tag.content,
			reply: { messageReference: message.reference?.messageId ?? message.id },
			allowedMentions: { parse: [], repliedUser: message.reference !== null },
		};

		await message.channel.send(options);
	}
);
