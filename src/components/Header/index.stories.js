import React from 'react';
import { action } from '@storybook/addon-actions';

import { Header } from './index';
import { withPadding, withStore } from '../../stories/decorators';
import { user } from '../../stories/stubs';

const defaultProps = {
	currentUser: user,
	onLogOut: action( 'onLogOut' ),
	onSearch: action( 'onSearch' ),
	onShowChanges: action( 'onShowChanges' ),
	onShowSuper: action( 'onShowSuper' ),
	onWritePost: action( 'onWritePost' ),
};

export default {
	title: 'Interface|Header',
	decorators: [
		withStore(),
		withPadding(),
	],
};

export const Default = () => (
	<Header
		{ ...defaultProps }
	/>
);
