import { action } from '@storybook/addon-actions';
import React from 'react';

import { withPadding, withStore } from '../../stories/decorators';
import { users } from '../../stories/stubs';

import Editor from './index';

export default {
	title: 'Interface|Editor',
	decorators: [
		withStore(),
		withPadding(),
	],
};

export const Basic = () => (
	<Editor
		onSubmit={ action( 'onSubmit' ) }
		users={ users }
	/>
);
