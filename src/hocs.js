import { connect } from 'react-redux';

import { users } from './types';

export const withCurrentUser = connect( state => ( {
	currentUser:        users.getSingle( state.users, state.users.current ),
	loadingCurrentUser: users.isPostLoading( state.users, state.users.current ),
} ) );
