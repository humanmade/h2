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
					reducer: (related, action, postId) => {
						switch (action.type) {
							case 'WP_API_REDUX_CREATE_COMMENTS_UPDATED':
								if (String(action.payload.object.post) === postId) {
									return {
										...related,
										items: [
											...related.items,
											action.payload.object.id
										]
									};
								}
								return related;
							default:
								return related;
						}
					},
				},
			},
			parseObject: object => {
				// if (object._embedded && object._embedded.replies) {
				// 	object._embedded.replies[0] = object._embedded.replies[
				// 		0
				// 	].map(comment => {
				// 		comment.post = object.id;
				// 		return comment;
				// 	});
				// }
				return object;
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
