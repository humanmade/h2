import { combineReducers } from 'redux';

import { reducer as plugins } from '../plugins';
import { comments, media, pages, posts, reactions } from '../types';

import features from './features';
import session from './session';
import ui from './ui';
import users from './users';

export default combineReducers( {
	features,
	comments: comments.reducer,
	plugins,
	media: media.reducer,
	pages: pages.reducer,
	posts: posts.reducer,
	reactions: reactions.reducer,
	session,
	ui,
	users,
} );
