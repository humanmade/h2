import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

import { Changes } from './Changes';

export default {
	title: 'Interface|Changes',
	decorators: [
		withStore( {
			users: {
				current: user.id,
				loadingPost: [],
				posts: [
					user,
				],
			},
		} ),
	],
};

const commonProps = {
	currentUser: user,
	onDismiss: action( 'onDismiss' ),
	onUpdateCurrentUser: action( 'onUpdateCurrentUser' ),
};

export const Normal = () => (
	<Changes
		{ ...commonProps }
	/>
);

const userHasChanges = {
	...user,
	meta: {
		...user.meta,
		h2_last_updated: '2018-12-01T00:00:00Z',
	},
};

export const WithNew = () => (
	<Changes
		{ ...commonProps }
		currentUser={ userHasChanges }
	/>
);
