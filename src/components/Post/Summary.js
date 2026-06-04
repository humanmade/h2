import { withArchive } from '@humanmade/repress';
import uniq from 'lodash/uniq';
import React from 'react';
import { Slot } from 'react-slot-fill';

import { withUser } from '../../hocs';
import { comments } from '../../types';
import Avatar from '../Avatar';
import Button from '../Button';

import './Summary.css';

const _n = ( single, plural, count ) => count === 1 ? `1 ${ single }` : `${ count } ${ plural }`;

const Person = props => {
	if ( ! props.user ) {
		return null;
	}

	return (
		<Avatar
			size={ 30 }
			url={ props.user.avatar_urls['96'] }
			user={ props.user }
			withHovercard={ false }
		/>
	);
};

const ConnectedPerson = withUser( props => props.id )( Person );

function Summary( props ) {
	const { comments, loadingComments, post, postVisible, onExpand } = props;

	const continueReadingMessage = `Continue reading (${ _n( 'word', 'words', post.content.count ) })`;

	// The archive is shared with the comment stream and so includes
	// `slack_mention` markers; exclude them from the count and avatar pile so
	// they never read as human comments.
	const realComments = comments ? comments.filter( comment => comment.type === 'comment' ) : [];

	const people = uniq( realComments.map( comment => comment.author ) ).filter( Boolean );

	const peopleClass = [
		'Post-Summary-people',
		people.length >= 8 && 'Post-Summary-people__overflow',
	].filter( Boolean ).join( ' ' );

	return (
		<div className="Post-Summary">
			<div className="Post-Summary-actions">
				<Button onClick={ onExpand }>
					{ postVisible ? (
						'Show comments'
					) : (
						continueReadingMessage
					) }
				</Button>

				{ ( ! loadingComments && realComments.length > 0 ) && (
					<div className="Post-Summary-comments">
						<span>{ _n( 'comment', 'comments', realComments.length ) }</span>
						<ul className={ peopleClass }>
							{ people.slice( 0, 8 ).map( person => (
								<li key={ person }>
									<ConnectedPerson id={ person } />
								</li>
							) ) }
						</ul>
					</div>
				) }
			</div>
			<div className="Post-Summary-actions align-right">
				<Slot name="Post.summary_actions" fillChildProps={ { post } } />
			</div>
		</div>
	);
}

export default withArchive(
	comments,
	state => state.comments,
	props => {
		const { post } = props;

		// Share the comment stream's widened archive (same id + slack_markers
		// flag) so the count stays consistent with the stream after a reply and
		// the post's comments are fetched once. Markers are filtered out of the
		// count above.
		const archiveId = `stream:${ post.id }`;
		comments.registerArchive( archiveId, {
			post: post.id,
			per_page: 100,
			slack_markers: 1,
		} );
		return archiveId;
	},
	{
		mapDataToProps: data => ( {
			comments: data.posts,
			loadingComments: data.loading,
		} ),
	}
)( Summary );
