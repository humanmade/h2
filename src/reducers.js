// @flow
import { combineReducers } from 'redux';
import store from './store';
import type { Action, WriteCommentsState } from './types';
import FrontKit from '@humanmade/frontkit';

export default combineReducers({
	user: (state = {}, action) => {
		switch (action.type) {
			case 'USER_UPDATED':
				return action.payload.user;
			default:
				return state;
		}
	},
	users: store.reducers.users,
	categories: store.reducers.categories,
	posts: store.reducers.posts,
	tags: store.reducers.tags,
	comments: store.reducers.comments,
	writeComments: (state: WriteCommentsState = {}, action: Action) => {
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
					}
				}
			default:
				return state;
		}
	},
});
