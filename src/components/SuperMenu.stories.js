import { action } from '@storybook/addon-actions';
import React from 'react';
import { SuperMenu } from './SuperMenu';

import { withStore } from '../stories/decorators';

export default {
	title: 'Interface|Super Menu',
	decorators: [
		withStore(),
	],
};

const sites = [
	{
		id: 1,
		url: 'https://example.com/updates/',
		name: 'Updates',
	},
	{
		id: 2,
		url: 'https://example.com/dev/',
		name: 'Dev',
	},
];

const commonProps = {
	categories: [],
	sites: [],
	visible: true,
	onClose: action( 'onClose' ),
};

export const Empty = () => (
	<SuperMenu
		{ ...commonProps }
	/>
);

export const Sites = () => (
	<SuperMenu
		{ ...commonProps }
		sites={ { data: sites } }
	/>
);
Sites.story = {
	name: 'With Sites',
};
