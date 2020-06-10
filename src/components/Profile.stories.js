import { action } from '@storybook/addon-actions';
import React from 'react';
import { Profile } from './Profile';

import { withCentering, withStore } from '../stories/decorators';
import { user } from '../stories/stubs';

export default {
	title: 'Interface|Profile',
	decorators: [
		withStore(),
		withCentering( {
			marginTop: 40,
			marginBottom: 40,
		} ),
	],
};

const commonProps = {
	loadingUser: false,
	user,
	onClose: action( 'onClose' ),
	onViewComments: action( 'onViewComments' ),
};

export const Basic = () => (
	<Profile
		{ ...commonProps }
	/>
);
