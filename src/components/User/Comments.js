import { withPagedArchive } from '@humanmade/repress';
import React from 'react';

import { comments } from '../../types';
import CommentLoader from '../Comment/Loader';
import MiniComment from '../Comment/Mini';
import Pagination from '../Pagination';

const getEmptyMessage = ( { comments, match, user } ) => {
	if ( ! comments ) {
		return 'Could not load these comments.';
	}

	// Pages past the end come back as an empty list, not an error.
	return Number( match.params.page ) > 1 ? 'There are no more comments.' : `${ user.name } hasn’t commented on anything yet.`;
};

function UserComments( props ) {
	const { hasMore, match } = props;

	if ( props.loading || props.loadingMore ) {
		return (
			<div className="pt-6">
				<CommentLoader />
				<CommentLoader />
			</div>
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
			<div className="pt-6 flex flex-col gap-4">
				{ props.comments.map( comment => (
					<MiniComment
						key={ comment.id }
						comment={ comment }
					/>
				) ) }
			</div>
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
