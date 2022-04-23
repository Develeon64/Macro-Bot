// tslint:disable-next-line: max-line-length
import { Embed as StandardEmbed } from "../deps.ts";
import type {
	EmbedPayload,
	User,
} from "../deps.ts";

export class DiscordEmbed extends StandardEmbed {
	public constructor (data?: EmbedPayload) {
		super(data);
		this.timestamp = this.timestamp || new Date().toISOString();
		this.color = this.color || Colors.Blue;
		this.footer = this.footer || { text: "Develeon64", icon_url: "https://cdn.discordapp.com/avatars/298215920709664768/8baae47e2e1bb0ab72b6a3881f7116d6.png" };
	}

	public setUser (author: User): DiscordEmbed {
		this.author = { name: author.username, icon_url: author.avatarURL() };
		return this;
	}

	public addBlankField (inline?: boolean): DiscordEmbed {
		this.addField("\u200b", "\u200b", inline);
		return this;
	}
}

export enum Colors {
	DarkGrey = 4144959,
	Grey = 8355711,
	LightGrey = 12566463,
	Blue = 4161471,
	Yellow = 12549951,
	LightGreen = 4177791,
	Green = 8372031,
	Purple = 8339391,
	Red = 12533631
}
