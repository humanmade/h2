import {
	SHOW_META_SIDEBAR,
	SHOW_SIDEBAR_PROFILE,
	HIDE_SIDEBAR_PROFILE,
	SHOW_SUPER_SIDEBAR,
	HIDE_SUPER_SIDEBAR,
} from '../actions';

const DEFAULT_STATE = {
	showingSuper: false,
	sidebarProfile: null,
};

export default function ui( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
		case SHOW_META_SIDEBAR:
			return {
				...state,
				sidebarView: 'meta',
			};

		case SHOW_SIDEBAR_PROFILE:
			return {
				...state,
				sidebarView: 'profile',
				sidebarProfile: action.id,
			};

		case HIDE_SIDEBAR_PROFILE:
			return {
				...state,
				sidebarView: null,
				sidebarProfile: null,
			};

		case SHOW_SUPER_SIDEBAR:
			return {
				...state,
				showingSuper: true,
			};

		case HIDE_SUPER_SIDEBAR:
			return {
				...state,
				showingSuper: false,
			};

		default:
			return state;
	}
}
