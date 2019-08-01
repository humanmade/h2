import { SET_CURRENT_USER } from '../actions';
import { users } from '../types';

const DEFAULT_STATE = {
	current: null,
};

export default function ( state, action ) {
	switch ( action.type ) {
		case SET_CURRENT_USER:
			return {
				...state,
				current: action.id,
			};

		// Pass all others through to the Repress reducer.
		default:
			return {
				...DEFAULT_STATE,
				...users.reducer( state, action ),
			};
	}
}
