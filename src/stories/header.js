import React from 'react';
import { storiesOf, action } from '@storybook/react';

import { user } from './stubs';
import { apiResponse } from './util';
import { Header } from '../components/Header';
import Logo from '../components/Header/Logo';

const defaultProps = {
	currentUser: apiResponse( user ),
	onLogOut: action( 'onLogOut' ),
	onSearch: action( 'onSearch' ),
	onShowChanges: action( 'onShowChanges' ),
	onShowSuper: action( 'onShowSuper' ),
	onWritePost: action( 'onWritePost' ),
};

storiesOf( 'Header', module )
	.add( 'Header', () => (
		<Header
			{ ...defaultProps }
		/>
	) )
	.add( 'Logo', () => <Logo /> );
