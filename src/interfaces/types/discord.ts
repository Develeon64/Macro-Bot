export type EmbedAuthor = {
	icon_url?: string,
	name?: string,
	proxy_icon_url?: string,
	url?: string
};

export type EmbedField = {
	inline?: boolean,
	name: string,
	value: string
};

export type EmbedFooter = {
	icon_url?: string,
	proxy_icon_url?: string,
	text: string
};

export type EmbedImage = {
	height?: number,
	proxy_url?: string,
	url?: string,
	width?: number
};

export type EmbedProvider = {
	name?: string,
	url?: string
};

export type EmbedVideo = {
	height?: number,
	url?: string,
	width?: number
};

export type Embed = {
	author?: EmbedAuthor,
	color?: number,
	description?: string,
	fields?: EmbedField[],
	footer?: EmbedFooter,
	image?: EmbedImage,
	provider?: EmbedProvider,
	thumbnail?: EmbedImage,
	timestamp?: string,
	title?: string,
	type?: "rich" | "image" | "video" | "gifv" | "article" | "link",
	url?: string,
	video?: EmbedVideo
};
