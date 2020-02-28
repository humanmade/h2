import { action } from '@storybook/addon-actions';
import React from 'react';

import { MetaSidebar } from './MetaSidebar';
import { withCentering, withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

export default {
	title: 'Interface|Meta Sidebar',
	decorators: [
		withStore(),
		withCentering( {
			width: 360,
		} ),
	],
}

const commonProps = {
	currentUser: user,
	features: [],
	loadingCurrentUser: false,
	onClose: action( 'onClose' ),
	onDisableFeature: action( 'onDisableFeature' ),
	onEnableFeature: action( 'onEnableFeature' ),
	onLogOut: action( 'onLogOut' ),
	onViewComments: action( 'onViewComments' ),
	onViewProfile: action( 'onViewProfile' ),
}

export const Basic = () => (
	<MetaSidebar
		{ ...commonProps }
	/>
);

export const Loading = () => (
	<MetaSidebar
		{ ...commonProps }
		loadingCurrentUser={ true }
	/>
);
