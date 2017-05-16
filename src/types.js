// @flow
export type Post = {
	title: {
		rendered: string,
		edited?: string,
	},
	content: {
		rendered: string,
		raw?: string,
		edited?: string,
	},
	author: number,
	id: number,
	date_gmt: string,
	related: {
		comments: {
			items: Array<number>,
			isLoading: boolean,
			hasLoaded: boolean,
		},
	},
};

export type User = {
	name: string,
	avatar_urls: {
		'96': string,
	},
};

export type WindowState = {
	items: Array<number>,
	totalObjects: number,
	totalPages: number,
	isLoading: Boolean,
};

export type Comment = {
	id: number,
	content: {
		rendered: string,
		raw: ?string,
		edited?: Object,
	},
	author: number,
	post: number,
};

export type Action = {
	type: string,
	payload?: any,
};

type objectState = {
	byId: {
		[number]: any,
	},
	windows: any,
	isLoading: boolean,
};

export type WriteCommentsState = {
	[number]: {
		isShowing: boolean,
		comment: Comment,
	},
};

export type WritePostState = {
	isShowing: boolean,
	post: Post,
};

export type PostsState = {
	byId: {
		[number]: Post,
	},
	isLoading: boolean,
	windows: {
		[string]: WindowState,
	},
};

export type UsersState = {
	byId: {
		[number]: User,
	},
	isLoading: boolean,
};

export type CommentsState = {
	byId: {
		[number]: Comment,
	},
	isLoading: boolean,
};

export type State = {
	users: UsersState,
	posts: PostsState,
	comments: CommentsState,
	categories: objectState,
	tags: objectState,
	writeComments: WriteCommentsState,
};

export type Dispatch = (action: Action) => void;
