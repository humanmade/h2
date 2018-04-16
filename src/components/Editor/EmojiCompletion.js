import { emojiIndex } from 'emoji-mart';
import React from 'react';

import Completion from './Completion';

import './EmojiCompletion.css';

const emoji = [
	...Object.values( emojiIndex.emojis ),
	...window.H2Data.site.emoji,
];

const EmojiCompletion = props => {
	const renderItem = ( { item, selected, onSelect } ) => {
		return <li
			key={ item.colons }
			className={ selected ? 'selected' : null }
			onClick={ onSelect }
		>
			{ item.imageUrl ? (
				<img
					className="EmojiCompletion-custom"
					src={ item.imageUrl }
				/>
			) : item.native }
			{ item.colons }
		</li>;
	};

	return <Completion
		{ ...props }
		matcher={ ( item, search ) => `${ item.colons } ${ item.name }`.toLowerCase().indexOf( search.toLowerCase() ) >= 0 }
		items={ emoji }
		renderItem={ renderItem }
		insert={ item => ( item.native || item.colons ) + ' ' }
	/>;
};

export default EmojiCompletion;
