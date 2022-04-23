import { FileHandler as Handler } from "../../deps.ts";
import type { LogRecord } from "../../deps.ts";

export class FileHandler extends Handler {
	public handle (logRecord: LogRecord): void {
		super.handle(logRecord);
		this.flush();
	}
}
