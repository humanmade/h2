const now = new Date().toISOString().replace( 'Z', '' );

export const comment = {
	id: 1,
	post: 1,
	date_gmt: now,
	author: 1,
	content: {
		rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!',
		raw: 'awd',
	},
};

export const post = {
	id: 1,
	date_gmt: now,
	author: 1,
	categories: [],
	link: 'http://example.com/2018/01/01/exploring/',
	title: { rendered: 'Exploring the idea of Platform' },
	content: { rendered: 'Heading up to Oregon for my brother and sister-in-law’s birthday celebrations! I’ll be out May 4-7!' },
	related: {
		comments: {
			items: [],
			isLoading: false,
			hasLoaded: false,
		},
	},
};

export const user = {
	name: 'Noel',
	slug: 'noel',
	avatar_urls: {
		'48': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=48&d=mm&r=g',
		'96': 'https://secure.gravatar.com/avatar/c57c8945079831fa3c19caef02e44614?s=96&d=mm&r=g',
	},
};

export const users = [
	user,
	{
		...user,
		name: 'Joe',
		slug: 'joe',
	},
	{
		...user,
		name: 'Tom',
		slug: 'tomwillmot',
	},
];
