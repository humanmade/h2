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
