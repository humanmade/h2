import { withArchive } from '@humanmade/repress';
import React from 'react';
import { connect } from 'react-redux';

import { users } from '../../types';
import Error404 from '../Error404';
import PageTitle from '../PageTitle';
import PostLoader from '../Post/Loader';

import UserComments from './Comments';
import UserHeader from './Header';
import UserPosts from './Posts';

function MissingUser( props ) {
	if ( props.loading ) {
		return (
			<PageTitle title="Loading…">
				<div className="PostsList">
					<PostLoader />
					<PostLoader />
				</div>
			</PageTitle>
		);
	}

	return (
		<PageTitle title="Not Found">
			<div className="PostsList">
				<Error404>
					<p>No user found at this address.</p>
				</Error404>
			</div>
		</PageTitle>
	);
}

// Only the first 200 users are preloaded, so look up any others by slug. Once
// loaded they're in the store, where UserPage picks them up.
const UserLookup = withArchive(
	users,
	state => state.users,
	props => {
		const id = `slug/${ props.slug }`;
		users.registerArchive( id, { slug: props.slug } );
		return id;
	}
)( MissingUser );

export function UserPage( props ) {
	const { match, user } = props;

	if ( ! user ) {
		return <UserLookup slug={ match.params.authorSlug } />;
	}

	const { view } = match.params;
	const isComments = view === 'comments';
	const List = isComments ? UserComments : UserPosts;

	return (
		<PageTitle title={ isComments ? `Comments by ${ user.name }` : user.name }>
			<div>
				<UserHeader user={ user } view={ view } />
				<List match={ match } user={ user } />
			</div>
		</PageTitle>
	);
}

const mapStateToProps = ( state, props ) => ( {
	user: state.users.posts.find( user => user.slug === props.match.params.authorSlug ),
} );

export default connect( mapStateToProps )( UserPage );
