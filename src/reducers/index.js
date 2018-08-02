import { combineReducers } from 'redux';

import features from './features';
import { reducer as plugins } from '../plugins';
import ui from './ui';

export default combineReducers( {
	features,
	plugins,
	ui,
} );
