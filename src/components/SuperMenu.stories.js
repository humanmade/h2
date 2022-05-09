import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStore } from '../stories/decorators';

import { SuperMenu } from './SuperMenu';

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

export const WithSites = () => (
	<SuperMenu
		{ ...commonProps }
		sites={ { data: sites } }
	/>
);
