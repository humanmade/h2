import React from 'react';
import { action } from 'storybook/actions';

import { withCentering } from '../stories/decorators';

import EmojiPicker from './EmojiPicker';

export default {
	title: 'Components/EmojiPicker',
	decorators: [
		withCentering(),
	],
};

export const Basic = () => (
	<EmojiPicker
		onDismiss={ action( 'onDismiss' ) }
		onSelect={ action( 'onSelect' ) }
	/>
);
