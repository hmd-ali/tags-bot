import { config } from "dotenv";

config();
export const env = {
	discord: {
		token: loadString("DISCORD_TOKEN"),
		clientId: loadString("DISCORD_CLIENT_ID"),
		serverId: loadString("DISCORD_SERVER_ID"),
	},
	database: {
		url: loadString("DATABASE_URL"),
	},
	roles: {
		moderator: loadString("MODERATOR_ROLE_ID"),
	},
};

function loadString(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}
