import { action } from '@storybook/addon-actions';
import React from 'react';

import { withPadding, withStore } from '../../stories/decorators';
import { user } from '../../stories/stubs';

import { Header } from './index';

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
