import { emojiIndex } from 'emoji-mart';
import React from 'react';

import Completion from './Completion';

import './EmojiCompletion.css';

const EmojiCompletion = props => {
	const renderItem = ( { item, selected, onSelect } ) => {
		return <li
			key={ item.colons }
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
		</li>;
	};

	const getItems = search => emojiIndex.search(
		search,
		{
			custom:     window.H2Data.site.emoji,
			maxResults: 5,
		}
	);

	return <Completion
		{ ...props }
		getItems={ getItems }
		renderItem={ renderItem }
		insert={ item => ( item.native || item.colons ) + ' ' }
	/>;
};

export default EmojiCompletion;
