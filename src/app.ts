import {
	DiscordBot,
} from "./discord.ts";

const _bot: DiscordBot = new DiscordBot({ token: JSON.parse(Deno.readTextFileSync("var/conf/config.json")).token });
