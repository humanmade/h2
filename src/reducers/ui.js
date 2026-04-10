import {
	SHOW_META_SIDEBAR,
	SHOW_SIDEBAR_CATEGORIES,
	SHOW_SIDEBAR_COMMENTS,
	SHOW_SIDEBAR_PAGES,
	SHOW_SIDEBAR_POSTS,
	SHOW_SIDEBAR_PROFILE,
	HIDE_SIDEBAR,
	SHOW_SUPER_SIDEBAR,
	HIDE_SUPER_SIDEBAR,
	SET_DEFAULT_POST_VIEW,
} from '../actions';

const DEFAULT_STATE = {
	defaultPostView: 'expanded',
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

		case SHOW_SIDEBAR_COMMENTS:
			return {
				...state,
				sidebarView: 'comments',
				sidebarProfile: action.id,
			};

		case SHOW_SIDEBAR_CATEGORIES:
			return {
				...state,
				sidebarView: 'categories',
			};

		case SHOW_SIDEBAR_PAGES:
			return {
				...state,
				sidebarView: 'pages',
			};

		case SHOW_SIDEBAR_POSTS:
			return {
				...state,
				sidebarView: 'posts',
			};

		case SHOW_SIDEBAR_PROFILE:
			return {
				...state,
				sidebarView: 'profile',
				sidebarProfile: action.id,
			};

		case HIDE_SIDEBAR:
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

		case SET_DEFAULT_POST_VIEW:
			return {
				...state,
				defaultPostView: action.view,
			};

		default:
			return state;
	}
}
