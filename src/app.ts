import {
	log,
	LogRecord,
} from "./deps.ts";
import {
	DiscordBot,
} from "./discord.ts";
import { LogFormatter } from "./modules/logging/formatter.ts";
import {
	ConsoleHandler,
	FileHandler,
} from "./modules/logging/handlers.ts";

async function logSetup (): Promise<void> {
	await log.setup({
		handlers: {
			console: new ConsoleHandler("DEBUG", { formatter: (logRecord: LogRecord): string => LogFormatter.format(logRecord) }),
			file: new FileHandler("DEBUG", { filename: `logs/MacroBot_${LogFormatter.formatDate(new Date(), { file: true })}.log`, formatter: (logRecord: LogRecord): string => LogFormatter.format(logRecord) }),
			//discord: new DiscordHandler("DEBUG", { formatter: (logRecord: LogRecord): string => LogFormatter.format(logRecord) })
		},
		loggers: {
			System: {
				level: "DEBUG",
				handlers: ["console", "file", "discord"]
			},
			Discord: {
				level: "DEBUG",
				handlers: ["console", "file", "discord"]
			}
		}
	});
}

await logSetup();
log.getLogger("System").debug("Starting up!");
const _bot: DiscordBot = new DiscordBot({ token: JSON.parse(Deno.readTextFileSync("var/conf/config.json")).token });
