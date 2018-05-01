import { combineReducers } from 'redux';

import { reducer as plugins } from '../plugins';
import ui from './ui';

export default combineReducers( {
	plugins,
	ui,
} );
