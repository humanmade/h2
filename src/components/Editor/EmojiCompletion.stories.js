import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import EmojiCompletion, { Item } from './EmojiCompletion';
import { withCentering } from '../../stories/decorators';
import { emoji } from '../../stories/stubs';

export default {
	title: 'Interface|Editor/Completion/Emoji',
	decorators: [
		withCentering(),
	],
}

export const List = () => (
	<ol className="Completion">
		{ emoji.map( emoji => (
			<Item
				key={ emoji.colons }
				item={ emoji }
				onSelect={ action( 'onSelect' ) }
			/>
		) ) }
	</ol>
);

export const Selected = () => (
	<ol className="Completion">
		{ emoji.map( ( emoji, index ) => (
			<Item
				key={ emoji.colons }
				item={ emoji }
				selected={ index === 1 }
				onSelect={ action( 'onSelect' ) }
			/>
		) ) }
	</ol>
);

export const Interactive = () => {
	const [ value, setValue ] = useState( '' );
	const coords = {
		top: 28,
		left: 0,
	};
	return (
		<form>
			<input
				className="form__field--lg"
				type="text"
				value={ value }
				onChange={ e => setValue( e.target.value ) }
			/>

			<EmojiCompletion
				coords={ coords }
				text={ value }
				trigger=":"
				onSelect={ action( 'select' ) }
			/>
		</form>
	);
};
