import React from 'react';

import { customEmoji } from '../EmojiPicker';

import Completion from './Completion';

import './EmojiCompletion.css';

export const Item = ( { item, selected, onSelect } ) => {
	return (
		<li
			className={ selected ? 'selected' : null }
			onClick={ onSelect }
		>
			{ item.imageUrl ? (
				<img
					alt={ item.colons }
					className="EmojiCompletion-custom"
					src={ item.imageUrl }
				/>
			) : item.native }
			{ item.colons }
		</li>
	);
};

const EmojiCompletion = props => {
	const getItems = search => import( '../EmojiMart' ).then( ( { emojiIndex } ) => {
		if ( ! search.length ) {
			return null;
		}

		// Check if this is a special emoji first.
		const withPrefixSearch = emojiIndex.search(
			`:${ search }`,
			{
				custom: customEmoji,
				maxResults: 1,
			}
		);

		// Then run a regular search.
		const regularSearch = emojiIndex.search(
			search,
			{
				custom: customEmoji,
				maxResults: 5,
			}
		);

		// Finally, combine and return.
		return [
			...withPrefixSearch,
			...regularSearch,
		].slice( 0, 5 );
	} );

	return (
		<Completion
			{ ...props }
			getItems={ getItems }
			renderItem={ props => <Item { ...props } /> }
			insert={ item => ( item.native || item.colons ) + ' ' }
		/>
	);
};

export default EmojiCompletion;
