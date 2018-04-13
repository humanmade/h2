export const REGISTER_PLUGIN = 'REGISTER_PLUGIN';
export const SHOW_SIDEBAR_PROFILE = 'SHOW_SIDEBAR_PROFILE';
export const HIDE_SIDEBAR_PROFILE = 'HIDE_SIDEBAR_PROFILE';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export const showSidebarProfile = id => {
	return {
		type: SHOW_SIDEBAR_PROFILE,
		id,
	};
};

export const hideSidebarProfile = () => ( { type: HIDE_SIDEBAR_PROFILE } );
