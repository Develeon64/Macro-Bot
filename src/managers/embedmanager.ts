// tslint:disable-next-line: max-line-length
import { Embed as StandardEmbed } from "../deps.ts";
import { DiscordBot } from "../discord.ts";
import type {
	Embed,
	EmbedAuthor,
	EmbedField,
	EmbedFooter,
	EmbedImage,
	EmbedProvider,
	EmbedVideo,
} from "../interfaces/types/discord.ts";

export class DiscordEmbed {
	private readonly MAXCHARS: number = 6000;

	private author?: EmbedAuthor;
	private color?: number;
	private description?: string;
	private fields: EmbedField[];
	private footer?: EmbedFooter;
	private image?: EmbedImage;
	private provider?: EmbedProvider;
	private thumbnail?: EmbedImage;
	private timestamp?: string;
	private title?: string;
	private type?: "rich" | "image" | "video" | "gifv" | "article" | "link";
	private url?: string;
	private video?: EmbedVideo;

	public constructor (embed?: Embed) {
		this.setAuthor(embed?.author || { name: DiscordBot.guild?.name, icon_url: DiscordBot.guild?.iconURL() });
		this.color = embed?.color || Colors.Blue;
		this.setDescription(embed?.description);
		this.fields = embed?.fields || [];
		this.setFooter(embed?.footer || { text: "Develeon64", icon_url: `https://cdn.discordapp.com/avatars/298215920709664768/8baae47e2e1bb0ab72b6a3881f7116d6.png` });
		this.image = embed?.image;
		//this.provider = embed?.provider || { name: "Develeon Software", url: "https://www.develeon.de/" };
		this.thumbnail = embed?.thumbnail;
		this.timestamp = embed?.timestamp || new Date().toISOString();
		this.setTitle(embed?.title);
		this.type = "rich";
		this.url = embed?.url;
		this.video = undefined;
	}

	private getCharCount (): number {
		let count: number = this.title?.length || 0;
		count += this.description?.length || 0;
		count += this.footer?.text.length || 0;
		count += this.author?.name?.length || 0;

		for (const field of this.fields) {
			count += field.name.length || 0;
			count += field.value.length || 0;
		}

		return count;
	}

	public getAuthor (): EmbedAuthor | undefined {
		return this.author;
	}

	public setAuthor (value: EmbedAuthor | undefined): DiscordEmbed {
		this.author = value;
		return this;
	}

	public getColor (): number | undefined {
		return this.color;
	}

	public setColor (value: number | Colors | undefined): DiscordEmbed {
		this.color = value;
		return this;
	}

	public setColorRGB (red: number, green: number, blue: number): DiscordEmbed {
		this.color = red;
		this.color = (this.color << 8) + green;
		this.color = (this.color << 8) + blue;
		return this;
	}

	public getDescription (): string | undefined {
		return this.description;
	}

	public setDescription (value: string | undefined): DiscordEmbed {
		if (value) {
			const chars: number = this.getCharCount();
			value = value.substring(0, 2048);
			this.description = (chars + value.length <= this.MAXCHARS) ? value : value.substring(0, this.MAXCHARS - chars);
		}
		else {
			this.description = undefined;
		}

		return this;
	}

	public getFileds (): EmbedField[] {
		return this.fields;
	}

	public setFields (value: EmbedField[] | undefined) {
		this.fields = value || [];
	}

	public addField (value: EmbedField): DiscordEmbed {
		this.fields.push(value);
		return this;
	}

	public buildField (name: string, value: string, inline: boolean = false): DiscordEmbed {
		this.fields.push({ name, value, inline });
		return this;
	}

	public addBlankField (inline: boolean = false): DiscordEmbed {
		this.fields.push({ name: "\u200b", value: "\u200b", inline });
		return this;
	}

	public getFooter (): EmbedFooter | undefined {
		return this.footer;
	}

	public setFooter (value: EmbedFooter | undefined): DiscordEmbed {
		this.footer = value;
		return this;
	}

	public buildFooter (text: string, icon_url?: string, proxy_icon_url?: string): DiscordEmbed {
		return this.setFooter({ text, icon_url, proxy_icon_url });
	}

	public getImage (): EmbedImage | undefined {
		return this.image;
	}

	public setImage (value: EmbedImage | undefined): DiscordEmbed {
		this.image = value;
		return this;
	}

	public getThumbnail (): EmbedImage | undefined {
		return this.thumbnail;
	}

	public setThumbnail (value: EmbedImage | undefined): DiscordEmbed {
		this.thumbnail = value;
		return this;
	}

	public getTimestamp (): Date | undefined {
		return this.timestamp ? new Date(this.timestamp) : undefined;
	}

	public setTimestamp (value: string | Date | undefined): DiscordEmbed {
		if (value === undefined) this.timestamp = undefined;
		else if (typeof value === "string") this.timestamp = value;
		else this.timestamp = value.toISOString();

		return this;
	}

	public getTitle (): string | undefined {
		return this.title;
	}

	public setTitle (value: string | undefined): DiscordEmbed {
		if (value) {
			const chars: number = this.getCharCount();
			value = value.substring(0, 2048);
			this.title = (chars + value.length <= this.MAXCHARS) ? value : value.substring(0, this.MAXCHARS - chars);
		}
		else {
			this.title = undefined;
		}

		return this;
	}

	public getUrl (): string | undefined {
		return this.url;
	}

	public setUrl (value: string): DiscordEmbed {
		this.url = value;
		return this;
	}

	public toJSON (): StandardEmbed {
		return new StandardEmbed({
			title: this.title,
			type: this.type,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image,
			thumbnail: this.thumbnail,
			video: this.video,
			provider: this.provider,
			author: this.author,
			fields: this.fields
		});
	}

	public toString (): string {
		return JSON.stringify(this, null, 2);
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
