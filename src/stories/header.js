import React from 'react';
import { storiesOf, action } from '@storybook/react';

import Header from '../components/Header';
import Logo from '../components/Header/Logo';

storiesOf( 'Header', module )
	.add( 'Header', () => (
		<Header onWritePost={ () => {} } onWriteStatus={ () => {} }><Logo /></Header>
	) )
	.add( 'Logo', () => <Logo /> );
