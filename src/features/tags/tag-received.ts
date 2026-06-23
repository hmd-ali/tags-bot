import { Events } from "discord.js";
import { createEvent } from "@/common/events/create-event.js";
import { stripAllCode } from "@/util/strip-code.js";
import { getTagPrefix } from "@/util/tag-prefix.js";
import { TagService } from "./tag-service.js";

export const tagReceivedEvent = createEvent(
	{
		name: Events.MessageCreate,
	},
	async (message) => {
		if (message.author.bot || message.author.system) return;

		const prefix = getTagPrefix();
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

		await message.reply({
			content: tag.content,
			allowedMentions: { parse: [] },
		});
	}
);
