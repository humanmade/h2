import memoize from 'lodash/memoize';
import React from 'react';
import { connect } from 'react-redux';

import Completion, { Item as BaseItem } from './Completion';

const insert = ( item, props ) => `${ props.trigger }${ item.slug } `;
const matcher = memoize(
	( item, search ) => `${ item.slug } ${ item.name }`.toLowerCase().indexOf( search.toLowerCase() ) >= 0,
	( item, search ) => `${ item.id }:${ search }`
);

export const Item = ( { item, selected, onSelect } ) => (
	<BaseItem
		className="flex items-center whitespace-nowrap max-w-[500px]"
		selected={ selected }
		onSelect={ onSelect }
	>
		<img
			alt=""
			className="w-6 h-6 max-w-none"
			src={ item.avatar_urls[48] }
		/>
		<span className="mx-[0.5em] grow overflow-hidden text-ellipsis">{ item.name }</span>
		<span className="text-[0.8em]">@{ item.slug }</span>
	</BaseItem>
);

export const MentionCompletion = props => {
	return (
		<Completion
			{ ...props }
			items={ props.users }
			insert={ insert }
			matcher={ matcher }
			renderItem={ props => (
				<Item
					key={ props.slug }
					{ ...props }
				/>
			) }
		/>
	);
};

export default connect(
	state => ( { users: state.users.posts } )
)( MentionCompletion );
