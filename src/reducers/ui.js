import { SHOW_SIDEBAR_PROFILE, HIDE_SIDEBAR_PROFILE } from '../actions';

const DEFAULT_STATE = {
	sidebarProfile: null,
};

export default function ui( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SHOW_SIDEBAR_PROFILE:
			return {
				...state,
				sidebarProfile: action.id,
			};

		case HIDE_SIDEBAR_PROFILE:
			return {
				...state,
				sidebarProfile: null,
			};

		default:
			return state;
	}
}
