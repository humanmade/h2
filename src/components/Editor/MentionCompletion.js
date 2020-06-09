import memoize from 'lodash/memoize';
import React from 'react';
import { connect } from 'react-redux';

import Completion from './Completion';

import './MentionCompletion.css';

const insert = ( item, props ) => `${ props.trigger }${ item.slug } `;
const matcher = memoize(
	( item, search ) => `${ item.slug } ${ item.name }`.toLowerCase().indexOf( search.toLowerCase() ) >= 0,
	( item, search ) => `${ item.id }:${ search }`,
);

export const Item = ( { item, selected, onSelect } ) => (
	<li
		key={ item.slug }
		className={ selected ? 'MentionCompletion-item selected' : 'MentionCompletion-item' }
		onClick={ onSelect }
	>
		<img
			alt=""
			className="avatar"
			src={ item.avatar_urls[48] }
		/>
		<span className="name">{ item.name }</span>
		<span className="username">@{ item.slug }</span>
	</li>
);

export const MentionCompletion = props => {
	return (
		<Completion
			{ ...props }
			items={ props.users }
			insert={ insert }
			matcher={ matcher }
			renderItem={ props => <Item { ...props } /> }
		/>
	);
};

export default connect(
	state => ( { users: state.users.posts } ),
)( MentionCompletion );
