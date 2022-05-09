import { action } from '@storybook/addon-actions';
import React from 'react';

import { withCentering } from '../stories/decorators';

import EmojiPicker from './EmojiPicker';

export default {
	title: 'Components|EmojiPicker',
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
