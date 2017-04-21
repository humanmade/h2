// @flow

export type Post = {
	title: {
		rendered: string,
	},
	content: {
		rendered: string,
	},
	author: number,
	id: number,
};

export type User = {
	name: string,
	avatar_urls: {
		'96': string,
	},
};

export type Comment = {
	id: number,
	content: {
		rendered: string,
	},
	author: number,
};
