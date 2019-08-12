import { storiesOf } from '@storybook/react';
import React from 'react';

import withStore from './withStore';
import Avatar from '../components/Avatar';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Components' )
	.addDecorator( withStore( {} ) )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) );
