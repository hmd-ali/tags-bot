import { botOptionsCommand } from "@/features/bot-options/index.js";
import { tagCommand } from "@/features/tags/index.js";
import type { Command } from "./types.js";

export const commands = new Map<string, Command>(
	[tagCommand, botOptionsCommand].map((command) => [command.data.name, command])
);
