import {
	Client,
	Embed,
	event,
	Intents,
	Member,
	Message,
	TextChannel,
} from "./deps.ts";
import type {
	ClientOptions,
} from "./deps.ts";

interface BotOptions extends ClientOptions {
	syncCommands?: boolean;
	token: string
}

export class DiscordBot extends Client {
	public constructor (options?: BotOptions) {
		super(options);

		this.connect(options?.token, Intents.All);
	}

	@event("messageCreate")
	private async onMessageCreate (message: Message): Promise<void> {
		const authorRoles = await message.member?.roles.collection();

		if (!authorRoles?.has("963570325939945565") && message.content.toLowerCase().includes("@everyone")) {
			message.delete();
		}
	}

	@event("guildMemberAdd")
	private async onMemberJoin (member: Member): Promise<void> {
		await this.onMemberMovement(member, true);
	}

	@event("guildMemberRemove")
	private async onMemberLeave (member: Member): Promise<void> {
		await this.onMemberMovement(member, false);
	}

	private async onMemberMovement (member: Member, join: boolean): Promise<void> {
		const embed = new Embed();
		embed.setTimestamp(Date.now());
		embed.setFooter("Develeon64", "https://cdn.discordapp.com/avatars/298215920709664768/8baae47e2e1bb0ab72b6a3881f7116d6.png");
		embed.setAuthor(this.user?.username || "", this.user?.avatarURL())
		embed.setThumbnail(member.avatarURL());
		embed.setTitle(join ? "__**Member joined the server!**__" : "__**Member left the server!**__");
		embed.setDescription("Latest member movements:");

		embed.addField("__Username__", member.nick ? `${member.user.tag}\n${member.nick}` : member.user.tag, true);
		embed.addField("__ID__", member.id, true);
		embed.addField("__Joined__", `${this.formatDate(new Date(member.joinedAt), true)}\n\n${this.formatDate(new Date(member.joinedAt), false)}`, false);
		embed.addField("__Created__", `${this.formatDate(member.user.timestamp, true)}\n\n${this.formatDate(member.user.timestamp, false)}`, true);

		((await this.channels.collection()).get("963557777584832522") as TextChannel).send(embed);
	}

	private formatDate (date: Date, utc = true): string {
		if (utc) {
			return `\`${date.getUTCDate().toString().padStart(2, "0")}.${(date.getUTCMonth() + 1).toString().padStart(2, "0")}.${date.getUTCFullYear().toString().padStart(4, "0")} ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}\` (UTC)`;
		}
		else {
			return `\`${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear().toString().padStart(4, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}\``;
		}
	}
}
