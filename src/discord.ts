import {
	Client,
	event,
	Guild,
	GuildTextChannel,
	Intents,
	log,
	Member,
	Message,
	TextChannel,
} from "./deps.ts";
import type {
	ClientOptions,
} from "./deps.ts";
import { Colors, DiscordEmbed } from "./managers/embedmanager.ts";

interface BotOptions extends ClientOptions {
	syncCommands?: boolean;
	token: string
}

export class DiscordBot extends Client {
	private readonly logger: log.Logger;
	public static guild: Guild | undefined;

	public constructor (options?: BotOptions) {
		super(options);

		this.logger = log.getLogger("Discord");
		this.logger.debug("Bot is connecting!");
		this.connect(options?.token, Intents.All);
	}

	@event("ready")
	private async onReady (shard: number): Promise<void> {
		DiscordBot.guild = await this.guilds.fetch(JSON.parse(Deno.readTextFileSync("var/conf/config.json")).guild);
		this.logger.info(`Bot is connected on shard ${shard}, ready and fully functional!`)
	}

	@event("messageCreate")
	private async onMessageCreate (message: Message): Promise<void> {
		const authorRoles = await message.member?.roles.collection();

		if (!authorRoles?.has(JSON.parse(Deno.readTextFileSync("var/conf/config.json")).modRole) && message.content.toLowerCase().includes("@everyone")) {
			message.delete();
			this.logger.info(`Message containing @everyone from ${message.author.tag} in ${(message.channel as GuildTextChannel).name} was deleted!`);
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
		const embed = new DiscordEmbed();
		embed.setTimestamp(new Date());
		embed.setColor(Colors.Yellow);
		embed.setFooter({ text: "Develeon64", icon_url: "https://cdn.discordapp.com/avatars/298215920709664768/8baae47e2e1bb0ab72b6a3881f7116d6.png" });
		embed.setAuthor({ name: this.user?.username || "", icon_url: this.user?.avatarURL() });
		embed.setThumbnail({ url: member.avatarURL() });
		embed.setTitle(join ? "__**Member joined the server!**__" : "__**Member left the server!**__");
		embed.setDescription("Latest member movements:");

		embed.buildField("__Username__", member.nick ? `${member.user.tag}\n${member.nick}` : member.user.tag, true);
		embed.buildField("__ID__", member.id, true);
		embed.buildField("__Joined__", `${this.formatDate(new Date(member.joinedAt), true)}\n\n${this.formatDate(new Date(member.joinedAt), false)}`, false);
		embed.buildField("__Created__", `${this.formatDate(member.user.timestamp, true)}\n\n${this.formatDate(member.user.timestamp, false)}`, true);

		((await this.channels.collection()).get(JSON.parse(Deno.readTextFileSync("var/conf/config.json")).screenChannel) as TextChannel).send(embed.toJSON());
		this.logger.info(join ? `Member ${member.user.tag} (${member.id}) joined the server!` : `Member ${member.user.tag} (${member.id}) left the server!`);
	}

	private formatDate (date: Date, utc: boolean = true): string {
		if (utc) {
			return `\`${date.getUTCDate().toString().padStart(2, "0")}.${(date.getUTCMonth() + 1).toString().padStart(2, "0")}.${date.getUTCFullYear().toString().padStart(4, "0")} ${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}\` (UTC)`;
		}
		else {
			return `\`${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear().toString().padStart(4, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}\``;
		}
	}
}
