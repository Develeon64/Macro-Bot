import {
	Client,
	event,
	Guild,
	GuildTextChannel,
	Intents,
	log,
	Member,
	Message,
} from "./deps.ts";
import type {
	ClientOptions,
} from "./deps.ts";
import { Colors, DiscordEmbed } from "./managers/discordembed.ts";

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
		this.logger.info(`Bot is connected on shard ${shard}, ready and fully functional!`);
		this.updateMemberCount();
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
		const memberCount: number = (await member.guild.members.array()).length;
		const embed = new DiscordEmbed();
		embed.setTimestamp(new Date());
		embed.setColor(join ? Colors.Red : Colors.Yellow);
		embed.setAuthor({ name: this.user?.username || "", icon_url: this.user?.avatarURL() });
		embed.setThumbnail({ url: member.avatarURL() });
		embed.setTitle(`__**${member.user.tag} ${join ? "joined" : "left"} the server!**__`);
		embed.setDescription(`Latest member count: **${memberCount}**`);

		//embed.addField("__Username__", member.nick ? `${member.user.tag}\n${member.nick}` : member.user.tag, true);
		embed.addField("__ID__", member.id, true);
		if (member.nick) embed.addField("__Nickname__", member.nick, true);
		embed.addField("__Joined__", `${this.formatDate(new Date(member.joinedAt), true)}\n${this.formatDate(new Date(member.joinedAt), false)}`, false);
		embed.addField("__Created__", `${this.formatDate(member.user.timestamp, true)}\n${this.formatDate(member.user.timestamp, false)}`, true);

		((await this.channels.collection()).get(JSON.parse(Deno.readTextFileSync("var/conf/config.json")).screenChannel) as GuildTextChannel).send(embed.title, embed);
		this.logger.info(join ? `Member ${member.user.tag} (${member.id}) joined the server!` : `Member ${member.user.tag} (${member.id}) left the server!`);
		this.updateMemberCount();
	}

	private async updateMemberCount (): Promise<void> {
		const channel = ((await this.channels.collection()).get(JSON.parse(Deno.readTextFileSync("var/conf/config.json")).screenChannel) as GuildTextChannel);
		let count = 0;
		for (const member of await channel.guild.members.array()) {
			if (member.user.bot !== undefined && member.user.bot !== null && member.user.bot !== false)
			count++;
		}

		const channelNames = channel.name.split("_");
		if (channelNames.length > 1) channelNames.pop();

		channel.setName(`${channelNames.join("_")}_${count}`);
		this.logger.info(`Users on the server: ${count}`);
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
