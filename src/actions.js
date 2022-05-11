export const REGISTER_PLUGIN = 'REGISTER_PLUGIN';
export const SHOW_META_SIDEBAR = 'SHOW_META_SIDEBAR';
export const SHOW_SIDEBAR_PROFILE = 'SHOW_SIDEBAR_PROFILE';
export const SHOW_SIDEBAR_COMMENTS = 'SHOW_SIDEBAR_COMMENTS';
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR';
export const SHOW_SUPER_SIDEBAR = 'SHOW_SUPER_SIDEBAR';
export const HIDE_SUPER_SIDEBAR = 'HIDE_SUPER_SIDEBAR';
export const ENABLE_BETA_FEATURE = 'ENABLE_BETA_FEATURE';
export const DISABLE_BETA_FEATURE = 'DISABLE_BETA_FEATURE';
export const SET_DEFAULT_POST_VIEW = 'SET_DEFAULT_POST_VIEW';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_SESSION_EXPIRED = 'SET_SESSION_EXPIRED';

export const showSidebarProfile = id => {
	return {
		type: SHOW_SIDEBAR_PROFILE,
		id,
	};
};

export const showSidebarComments = id => {
	return {
		type: SHOW_SIDEBAR_COMMENTS,
		id,
	};
};

export const hideSidebar = () => ( { type: HIDE_SIDEBAR } );

export const showMetaSidebar = () => ( { type: SHOW_META_SIDEBAR } );

export const showSuperSidebar = () => ( { type: SHOW_SUPER_SIDEBAR } );
export const hideSuperSidebar = () => ( { type: HIDE_SUPER_SIDEBAR } );

export const enableBetaFeature = feature => ( {
	type: ENABLE_BETA_FEATURE,
	feature,
} );
export const disableBetaFeature = feature => ( {
	type: DISABLE_BETA_FEATURE,
	feature,
} );

export const setDefaultPostView = view => ( {
	type: SET_DEFAULT_POST_VIEW,
	view,
} );

export const setSessionExpired = message => ( {
	type: SET_SESSION_EXPIRED,
	message,
} );

/**
 * Thunk function to check session validity.
 *
 * @param {Function} dispatch Redux dispatch().
 * @param {Function} getState Redux getState().
 */
export const heartbeat = ( dispatch, getState ) => {
	if ( getState().session.expired ) {
		// Don't keep polling if we've determined we are offline.
		return;
	}

	const url = `${
		window.H2Data.site.api
	}?${ new URLSearchParams( {
		_wpnonce: window.H2Data.site.nonce,
	} ) }`;

	fetch( url, {
		method: 'HEAD',
		cache: 'no-cache',
		credentials: 'same-origin',
		headers: {
		  'Content-Type': 'application/json',
		},
	} ).then(
		response => {
			if ( response.status < 400 ) {
				return;
			}

			if ( response.status === 401 ) {
				dispatch( setSessionExpired( 'Not logged in' ) );
				return;
			}

			if ( response.status === 403 ) {
				dispatch( setSessionExpired( 'Session expired' ) );
				return;
			}

			dispatch( setSessionExpired( `Error ${ response.status }` ) );
		},
		error => {
			dispatch( setSessionExpired( error ) );
		}
	);
};
