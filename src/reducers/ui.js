import {
	SHOW_SIDEBAR_CATEGORIES,
	SHOW_SIDEBAR_PAGES,
	SHOW_SIDEBAR_POSTS,
	HIDE_SIDEBAR,
	SHOW_SUPER_SIDEBAR,
	HIDE_SUPER_SIDEBAR,
	SET_SUPER_SEARCH,
	SET_DEFAULT_POST_VIEW,
} from '../actions';

const DEFAULT_STATE = {
	defaultPostView: 'expanded',
	showingSuper: false,
	superSearch: '',
	superSearchSites: [],
};

export default function ui( state = DEFAULT_STATE, action ) {
	switch ( action.type ) {
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

		case HIDE_SIDEBAR:
			return {
				...state,
				sidebarView: null,
			};

		case SHOW_SUPER_SIDEBAR:
			return {
				...state,
				showingSuper: true,
				superSearchSites: action.sites || [],
			};

		case HIDE_SUPER_SIDEBAR:
			return {
				...state,
				showingSuper: false,
				superSearch: '',
			};

		case SET_SUPER_SEARCH:
			return {
				...state,
				superSearch: action.search,
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
