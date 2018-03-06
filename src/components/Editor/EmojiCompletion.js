import { emojiIndex } from 'emoji-mart';
import React from 'react';

import Completion from './Completion';

const EmojiCompletion = props => {
	const renderItem = ( { item, selected, onSelect } ) => {
		return <li
			key={ item.colons }
			className={ selected ? 'selected' : null }
			onClick={ onSelect }
		>{ item.native } { item.colons }</li>;
	};

	return <Completion
		{ ...props }
		matcher={ ( item, search ) => `${ item.colons } ${ item.name }`.toLowerCase().indexOf( search.toLowerCase() ) >= 0 }
		items={ Object.values( emojiIndex.emojis ) }
		renderItem={ renderItem }
		insert={ item => item.native + ' ' }
	/>;
};

export default EmojiCompletion;
