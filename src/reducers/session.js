import {
	SET_SESSION_EXPIRED,
} from '../actions';

const DEFAULT_STATE = {
	isExpired: false,
};

export default function ui( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SET_SESSION_EXPIRED:
			return {
				...state,
				isExpired: true,
				status: action.status,
			};

		default:
			return state;
	}
}
