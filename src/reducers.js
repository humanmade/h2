import { combineReducers } from 'redux';

import { reducer as plugins } from './plugins';

export default combineReducers( {
	plugins,
} );
