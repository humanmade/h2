import { withArchive } from '@humanmade/repress';
import { connect } from 'react-redux';

import { users } from './types';
import { withApiData } from './with-api-data';

export const withCategories = withApiData(
	props => ( {
		categories: '/wp/v2/categories?per_page=100',
	} )
);

export const withCurrentUser = connect( state => ( {
	currentUser: users.getSingle( state.users, state.users.current ),
	loadingCurrentUser: users.isPostLoading( state.users, state.users.current ),
} ) );

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
