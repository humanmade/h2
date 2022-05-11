import {
	SET_SESSION_EXPIRED,
} from '../actions';

const DEFAULT_STATE = {
	expired: false,
};

export default function ui( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SET_SESSION_EXPIRED:
			return {
				...state,
				expired: true,
				message: action.message,
			};

		default:
			return state;
	}
}
