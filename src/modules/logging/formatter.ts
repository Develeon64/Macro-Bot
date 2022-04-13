import type { LogRecord } from "../../deps.ts";

export class LogFormatter {
	public static format (logRecord: LogRecord): string {
		let msg: string = "";
		for (const line of logRecord.msg.split("\n"))
			msg += `${LogFormatter.formatDate(logRecord.datetime)} | ${logRecord.loggerName.substring(0, 8).padEnd(8)} | ${logRecord.levelName.padEnd(8)} | ${line}\n`;
		return msg.trim();
	}

	public static formatDate (date: Date = new Date(), options?: { file?: boolean }): string {
		const file = options?.file || false;

		const dateString: string = file ? `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getFullYear().toString().padStart(4, "0")}`
										: `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear().toString().padStart(4, "0")}`;
		const timeString: string = file ? `${date.getHours().toString().padStart(2, "0")}-${(date.getMinutes() + 1).toString().padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}`
										: `${date.getHours().toString().padStart(2, "0")}:${(date.getMinutes() + 1).toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

		return file ? dateString : `${dateString} ${timeString}`;
	}
}
