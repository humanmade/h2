import { combineReducers } from 'redux';

import features from './features';
import { reducer as plugins } from '../plugins';
import { comments, media, posts, reactions } from '../types';
import ui from './ui';
import users from './users';

export default combineReducers( {
	features,
	comments: comments.reducer,
	plugins,
	media: media.reducer,
	posts: posts.reducer,
	reactions: reactions.reducer,
	ui,
	users,
} );
