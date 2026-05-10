import type { InteractionReplyOptions } from "discord.js";
import { Tags } from "./tags.js";
import { User } from "./user.js";

export type ErrorMessage =
	| Required<InteractionReplyOptions>["components"][number]
	| ((
			...args: string[]
	  ) => Required<InteractionReplyOptions>["components"][number]);

export const ErrorMessages = {
	Tags,
	User,
} satisfies Record<string, Record<string, ErrorMessage>>;
