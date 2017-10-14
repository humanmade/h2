import FrontKit from '@humanmade/frontkit';
import { combineReducers } from 'redux';

import store from './store';

export default combineReducers({
	user: store.reducers.user,
	users: store.reducers.users,
	categories: store.reducers.categories,
	posts: store.reducers.posts,
	tags: store.reducers.tags,
	comments: store.reducers.comments,
	// state: WriteCommentsState = {}, action: Action
	writeComments: (state = {}, action) => {
		switch (action.type) {
			case 'WP_API_REDUX_FETCH_POSTS_UPDATED':
				const s = { ...state };
				action.payload.objects.forEach(post => {
					s[post.id] = {
						isShowing: false,
						comment: {
							post: post.id,
							content: {
								rendered: '',
								raw: '',
								edited: FrontKit.content(),
							},
							author: 0,
							id: 0,
						},
					};
				});
				return s;
			case 'SHOW_REPLY_TO_POST':
				return {
					...state,
					[action.payload.postId]: {
						...state[action.payload.postId],
						isShowing: true,
					},
				};
			case 'WRITE_COMMENT_CANCELLED':
				return {
					...state,
					[action.payload.postId]: {
						...state[action.payload.postId],
						isShowing: false,
					},
				};
			case 'WRITE_COMMENT_UPDATED':
				return {
					...state,
					[action.payload.postId]: {
						...state[action.payload.postId],
						comment: {
							...state[action.payload.postId].comment,
							...action.payload.comment,
						},
					},
				};
			case 'WP_API_REDUX_CREATE_COMMENTS_UPDATED':
				return {
					...state,
					[action.payload.object.post]: {
						isShowing: false,
						comment: {
							post: action.payload.object.post,
							content: {
								rendered: '',
								raw: '',
								edited: FrontKit.content(),
							},
							author: 0,
							id: 0,
						},
					},
				};
			default:
				return state;
		}
	},
	// action: Action
	writePost: (
		state = {
			isShowing: false,
			post: {
				title: {
					rendered: '',
					edited: '',
				},
				id: 0,
				content: { rendered: '', raw: '', edited: FrontKit.content() },
				date_gmt: new Date().toISOString(),
			},
		},
		action
	) => {
		switch (action.type) {
			case 'SHOW_WRITE_POST':
				return {
					...state,
					isShowing: true,
				};
			case 'WRITE_POST_CANCELLED':
				return {
					...state,
					isShowing: false,
				};
			case 'WRITE_POST_UPDATED':
				return {
					...state,
					post: {
						...state.post,
						...action.payload.post,
					},
				};
			case 'WP_API_REDUX_CREATE_POSTS_UPDATED':
				return {
					...state,
					isShowing: false,
					post: {
						title: {
							rendered: '',
							edited: '',
						},
						id: 0,
						content: { rendered: '', raw: '', edited: FrontKit.content() },
						date_gmt: new Date().toISOString(),
					},
				};
			default:
				return state;
		}
	},
});
