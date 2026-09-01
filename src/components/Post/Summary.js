import { withArchive } from '@humanmade/repress';
import uniq from 'lodash/uniq';
import React from 'react';
import { Slot } from 'react-slot-fill';

import { withUser } from '../../hocs';
import { comments } from '../../types';
import Avatar from '../Avatar';
import Button from '../Button';

const _n = ( single, plural, count ) => count === 1 ? `1 ${ single }` : `${ count } ${ plural }`;
const COMMENT_SUMMARY_LIMIT = 100;

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
	const {
		comments,
		hasMoreComments,
		loadingComments,
		loadingMoreComments,
		onExpand,
		onLoadMoreComments,
		post,
		postVisible,
	} = props;

	const continueReadingMessage = `Continue reading (${ _n( 'word', 'words', post.content.count ) })`;

	// The archive is shared with the comment stream and so includes
	// `slack_mention` markers; exclude them from the count and avatar pile so
	// they never read as human comments.
	const realComments = comments ? comments.filter( comment => comment.type === 'comment' ) : [];
	const hasSlackMarkers = comments ? comments.some( comment => comment.type === 'slack_mention' ) : false;

	React.useEffect( () => {
		if (
			loadingComments
			|| loadingMoreComments
			|| ! hasMoreComments
			|| ! hasSlackMarkers
			|| realComments.length >= COMMENT_SUMMARY_LIMIT
		) {
			return;
		}

		onLoadMoreComments( null );
	}, [
		hasMoreComments,
		hasSlackMarkers,
		loadingComments,
		loadingMoreComments,
		onLoadMoreComments,
		realComments.length,
	] );

	const people = uniq( realComments.map( comment => comment.author ) ).filter( Boolean );

	const peopleClass = [
		// Back-compat:
		'Post-Summary-people',

		'relative list-none m-0 ml-[0.5em] pl-[3px] self-baseline',
		people.length >= 8 && [
			'before:block before:content-["_"]',
			'before:absolute before:left-0 before:top-0 before:bottom-0',
			'before:w-[63px] before:z-2',
			'before:bg-linear-to-r before:from-white before:to-transparent',
			'before:pointer-events-none',
		].join( ' ' ),
	].filter( Boolean ).join( ' ' );

	return (
		<div className="my-[1em] ml-[90px] text-sm text-[#aaa] [&_.btn]:font-[inherit] [&_.btn]:mb-0 max-[960px]:ml-0">
			<div className="Post-Summary-actions my-[5px] flex items-center justify-between max-[600px]:flex-col max-[600px]:items-start">
				<Button
					size="small"
					onClick={ onExpand }
				>
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
								<li
									className="w-[30px] h-[30px] rounded-full inline-block border border-white bg-white relative shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] transition-all duration-200 ease-linear z-1 nth-child(n+2):-ml-3"
									key={ person }
								>
									<ConnectedPerson id={ person } />
								</li>
							) ) }
						</ul>
					</div>
				) }
			</div>
			<div className="Post-Summary-actions my-[5px] flex items-center justify-between min-[601px]:justify-end min-[601px]:[&_.btn]:mr-0 min-[601px]:[&_.btn]:ml-[7.5px]">
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
			per_page: COMMENT_SUMMARY_LIMIT,
			slack_markers: 1,
		} );
		return archiveId;
	},
	{
		mapDataToProps: data => ( {
			comments: data.posts,
			hasMoreComments: data.hasMore,
			loadingComments: data.loading,
			loadingMoreComments: data.loadingMore,
		} ),
		mapActionsToProps: actions => ( {
			onLoadMoreComments: actions.onLoadMore,
		} ),
	}
)( Summary );
