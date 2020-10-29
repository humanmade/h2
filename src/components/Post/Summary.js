import { withArchive } from '@humanmade/repress';
import uniq from 'lodash/uniq';
import React from 'react';

import Avatar from '../Avatar';
import Button from '../Button';
import { withUser } from '../../hocs';
import { comments } from '../../types';

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
	const { comments, post, postVisible, onExpand } = props;

	if ( props.loadingComments ) {
		return null;
	}

	const people = comments ? uniq( comments.map( comment => comment.author ) ).filter( Boolean ) : [];

	const peopleClass = [
		'Post-Summary-people',
		people.length >= 8 && 'Post-Summary-people__overflow',
	].filter( Boolean ).join( ' ' );

	return (
		<div className="Post-Summary">
			<Button onClick={ onExpand }>
				{ postVisible ? (
					'Show comments'
				 ) : (
					`Continue reading (${ _n( 'word', 'words', post.content.count ) })`
				 ) }
			</Button>

			{ ( comments && comments.length > 0 ) && (
				<div className="Post-Summary-comments">
					<span>{ _n( 'comment', 'comments', comments.length ) }</span>
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
	);
}

export default withArchive(
	comments,
	state => state.comments,
	props => {
		const { post } = props;

		comments.registerArchive( post.id, { post: post.id } );
		return post.id;
	},
	{
		mapDataToProps: data => ( {
			comments: data.posts,
			loadingComments: data.loading,
		} ),
	}
)( Summary );
