import WPAPIRedux from './wp-api-redux';
import api from './api';

export default new WPAPIRedux({
	api: api,
	objects: {
		posts: {
			route: '/wp/v2/posts',
			windows: {
				feed: {

				}
			},
			relations: {
				author: {
					uri: 'author',
					singular: true,
					object: 'users',
				},
				comments: {
					uri: 'replies',
					object: 'comments',
				},
			},
			parseObject: object => {
				if (object._embedded && object._embedded.replies) {
					object._embedded.replies[0] = object._embedded.replies[
						0
					].map(comment => {
						comment.post = object.id;
						return comment;
					});
				}
				return object;
			},
			reducer: (post, action) => {
				switch (action.type) {
					case 'WP_API_REDUX_CREATE_COMMENTS_UPDATED':
						if (action.payload.object.post === post.id) {
							return {
								...post,
								related: {
									...post.related,
									comments: {
										...post.related.comments,
										items: [...post.related.comments.items, action.payload.object.id],
									},
								},
							};
						}
						return post;
					default:
						return post;
				}
			},
		},
		users: {
			route: '/wp/v2/users',
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
