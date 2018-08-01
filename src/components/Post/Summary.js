import { uniq } from 'lodash/array';
import React from 'react';

import Avatar from '../Avatar';
import Button from '../Button';
import { withApiData } from '../../with-api-data';

import './Summary.css';

const _n = ( single, plural, count ) => count === 1 ? `1 ${ single }` : `${ count } ${ plural }`;

const Person = props => {
	if ( ! props.user.data ) {
		return null;
	}

	return (
		<Avatar
			size={ 30 }
			url={ props.user.data ? props.user.data.avatar_urls['96'] : '' }
			user={ props.user.data }
			withHovercard={ false }
		/>
	);
};

const ConnectedPerson = withApiData( props => ( { user: `/wp/v2/users/${ props.id }` } ) )( Person );

export default function Summary( props ) {
	const { comments, post, onExpand } = props;

	const people = uniq( comments.map( comment => comment.author ) ).filter( Boolean );

	const peopleClass = [
		'Post-Summary-people',
		people.length >= 8 && 'Post-Summary-people__overflow',
	].filter( Boolean ).join( ' ' );

	return (
		<div className="Post-Summary">
			<Button onClick={ onExpand }>
				Continue reading ({ _n( 'word', 'words', post.content.count ) })
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
