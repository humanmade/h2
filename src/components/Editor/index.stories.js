import React from 'react';
import { action } from '@storybook/addon-actions';

import Editor from './index';
import { withPadding, withStore } from '../../stories/decorators';
import { users } from '../../stories/stubs';

export default {
	title: 'Editor',
	decorators: [
		withStore(),
		withPadding(),
	],
}

export const Basic = () => (
	<Editor
		onSubmit={ action( 'onSubmit' ) }
		users={ users }
	/>
);
