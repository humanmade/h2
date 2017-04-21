import WPAPIRedux from './wp-api-redux';
import api from './api';

export default new WPAPIRedux({
	api: api,
	objects: {
		posts: {
			route: '/wp/v2/posts',
			relations: {
				author: {
					uri: 'author',
					singular: true,
					object: 'users',
				},
				categories: {
					uri: 'wp:term',
					object: 'categories',
					filter: relation => relation.taxonomy === 'category',
				},
				tags: {
					uri: 'wp:term',
					object: 'tags',
					filter: relation => relation.taxonomy === 'tag',
				},
				comments: {
					uri: 'replies',
					object: 'comments',
				},
			},
		},
		users: {
			route: '/wp/v2/users',
		},
		tags: {
			route: '/wp/v2/tags',
		},
		categories: {
			route: '/wp/v2/categories',
		},
		comments: {
			route: '/wp/v2/comments',
		},
		user: {
			route: '/wp/v2/users/me',
			singular: true,
		},
	},
});
