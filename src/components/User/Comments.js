import { withPagedArchive } from '@humanmade/repress';
import React from 'react';

import { comments } from '../../types';
import Pagination from '../Pagination';

import UserComment, { UserCommentLoader } from './Comment';

const getEmptyMessage = ( { comments, match, user } ) => {
	if ( ! comments ) {
		return 'Could not load these comments.';
	}

	// Pages past the end come back as an empty list, not an error.
	return Number( match.params.page ) > 1 ? 'There are no more comments.' : `${ user.name } hasn’t commented on anything yet.`;
};

function UserComments( props ) {
	const { hasMore, match, user } = props;

	if ( props.loading || props.loadingMore ) {
		return (
			<React.Fragment>
				<UserCommentLoader />
				<UserCommentLoader />
			</React.Fragment>
		);
	}

	if ( ! props.comments || ! props.comments.length ) {
		return (
			<React.Fragment>
				<p className="py-6 m-0 text-sm text-gray-500">
					{ getEmptyMessage( props ) }
				</p>
				<Pagination
					hasNext={ false }
					label="Comment pages"
					params={ match.params }
					path={ match.path }
				/>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
			{ props.comments.map( comment => (
				<UserComment
					key={ comment.id }
					comment={ comment }
					user={ user }
				/>
			) ) }
			<Pagination
				hasNext={ hasMore }
				label="Comment pages"
				params={ match.params }
				path={ match.path }
			/>
		</React.Fragment>
	);
}

export default withPagedArchive(
	comments,
	state => state.comments,
	props => {
		const id = `user/${ props.user.id }`;
		comments.registerArchive( id, {
			author: props.user.id,
		} );
		return id;
	},
	{
		getPage: props => Number( props.match.params.page || 1 ),
		mapDataToProps: data => ( {
			comments: data.posts,
			hasMore: data.hasMore,
			loading: data.loading,
			loadingMore: data.loadingMore,
		} ),
	}
)( UserComments );
