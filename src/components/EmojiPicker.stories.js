import { action } from '@storybook/addon-actions';
import React from 'react';

import EmojiPicker from './EmojiPicker';
import { withCentering } from '../stories/decorators';

export default {
	title: 'Components|EmojiPicker',
	decorators: [
		withCentering(),
	],
}

export const Basic = () => (
	<EmojiPicker
		onDismiss={ action( 'onDismiss' ) }
		onSelect={ action( 'onSelect' ) }
	/>
);
