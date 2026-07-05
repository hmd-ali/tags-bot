import { interactionCreateEvent } from "@/features/interaction-create/index.js";
import { quoteReceived } from "@/features/quote/index.js";
import { readyEvent } from "@/features/ready/index.js";
import { tagReceivedEvent } from "@/features/tags/tag-received.js";
import type { DiscordEvent } from "./types.js";

export const events: DiscordEvent[] = [
	readyEvent,
	interactionCreateEvent,
	tagReceivedEvent,
	quoteReceived,
].flat();
