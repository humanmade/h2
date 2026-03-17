import { withArchive } from '@humanmade/repress';
import uniq from 'lodash/uniq';
import React from 'react';
import { Slot } from 'react-slot-fill';

import { withUser } from '../../hocs';
import { comments } from '../../types';
import Avatar from '../Avatar';
import Button from '../Button';

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

	const people = comments ? uniq( comments.map( comment => comment.author ) ).filter( Boolean ) : [];

	const peopleClass = [
		// Back-compat:
		'Post-Summary-people',

		'relative list-none m-0 ml-[0.5em] pl-[3px] self-baseline',
		people.length >= 8 && [
			'before:block before:content-["_"]',
			'before:absolute before:left-0 before:top-0 before:bottom-0',
			'before:w-[63px] before:z-[2]',
			'before:bg-gradient-to-r before:from-white before:to-transparent',
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

				{ ( ! loadingComments && comments && comments.length > 0 ) && (
					<div className="flex items-center max-[600px]:mt-[1em]">
						<span>{ _n( 'comment', 'comments', comments.length ) }</span>
						<ul className={ peopleClass }>
							{ people.slice( 0, 8 ).map( person => (
								<li
									className="w-[30px] h-[30px] rounded-full inline-block border border-white bg-white relative shadow-[0px_1px_3px_0px_rgba(0,0,0,0.2)] transition-all duration-200 ease-linear z-[1] nth-child(n+2):-ml-3"
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

		comments.registerArchive( post.id, {
			post: post.id,
			per_page: 100,
		} );
		return post.id;
	},
	{
		mapDataToProps: data => ( {
			comments: data.posts,
			loadingComments: data.loading,
		} ),
	}
)( Summary );
