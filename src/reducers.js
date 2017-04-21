import { combineReducers } from 'redux';
import store from './store';

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
});
