import { env } from "./../src/env.js";
import { commands } from "./../src/common/commands/index.js";
import {
  REST,
  type RESTPutAPIApplicationCommandsResult,
  Routes,
} from "discord.js";

export async function deployCommands(): Promise<void> {
  const commandData = [...commands.values()].map((command) => command.data);

  const rest = new REST({ version: "10" }).setToken(env.discord.token);

  try {
    const result = (await rest.put(
      Routes.applicationGuildCommands(
        env.discord.clientId,
        env.discord.serverId,
      ),
      {
        body: commandData,
      },
    )) as RESTPutAPIApplicationCommandsResult;
    console.log(
      `✅ Successfully deployed ${result.length} commands to guild ${env.discord.serverId}`,
    );
  } catch (error) {
    console.error("❌ Error deploying commands:", error);
  }
}

// If run directly with `node deploy.ts`
if (import.meta.url === `file://${process.argv[1]}`) {
  deployCommands();
}
