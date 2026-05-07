import { tagCommand } from "@/features/tags/index.js";
import { Command } from "./types.js";

export const commands = new Map<string, Command>(
  [tagCommand].map((command) => [command.data.name, command]),
);
