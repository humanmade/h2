import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { user } from './stubs';
import withStore from './withStore';
import { Header } from '../components/Header';
import Logo from '../components/Header/Logo';

const defaultProps = {
	currentUser: user,
	onLogOut: action( 'onLogOut' ),
	onSearch: action( 'onSearch' ),
	onShowChanges: action( 'onShowChanges' ),
	onShowSuper: action( 'onShowSuper' ),
	onWritePost: action( 'onWritePost' ),
};

const state = {};

storiesOf( 'Header', module )
	.addDecorator( withStore( state ) )
	.add( 'Header', () => (
		<Header
			{ ...defaultProps }
		/>
	) )
	.add( 'Logo', () => <Logo /> );
