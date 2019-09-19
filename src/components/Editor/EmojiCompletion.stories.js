import { action } from '@storybook/addon-actions';
import React from 'react';

import { Item } from './EmojiCompletion';
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
