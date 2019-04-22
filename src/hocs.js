import { withArchive, withSingle } from '@humanmade/repress';
import { connect } from 'react-redux';

import { users } from './types';
import { withApiData } from './with-api-data';

export const withCurrentUser = connect( state => ( {
	currentUser: users.getSingle( state.users, state.users.current ),
	loadingCurrentUser: users.isPostLoading( state.users, state.users.current ),
} ) );

export const withUser = id => withSingle(
	users,
	state => state.users,
	id,
	{
		mapDataToProps: data => ( {
			loadingUser: data.loading,
			user: data.post,
		} ),
	}
);

export const withUsers = withArchive(
	users,
	state => state.users,
	'all',
	{
		mapDataToProps: data => ( {
			loadingUsers: data.loading,
			users: data.posts,
		} ),
		mapActionsToProps: () => ( {} ),
	}
);

export const withCategories = withApiData( () => ( { categories: '/wp/v2/categories?per_page=100' } ) );
export const withSites = withApiData( () => ( { sites: '/h2/v1/site-switcher/sites' } ) );
export const withWidgets = withApiData( () => ( { widgets: '/h2/v1/widgets?sidebar=sidebar' } ) );
