import { DiscordEvent } from "./types.js";
import { interactionCreateEvent } from "@/features/interaction-create/index.js";
import { readyEvent } from "@/features/ready/index.js";
import { tagReceivedEvent } from "@/features/tags/tag-received.js";

export const events: DiscordEvent[] = [
  readyEvent,
  interactionCreateEvent,
  tagReceivedEvent,
].flat();
