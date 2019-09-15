import { storiesOf } from '@storybook/react';
import React from 'react';

import { htmlTester } from './stubs';
import { withCentering, withPadding, withStore } from './decorators';
import Avatar from '../components/Avatar';
import { Content } from '../components/Message/Content';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Base Styles' )
	.addDecorator( withPadding() )
	.add( 'Elements', () => (
		<div
			dangerouslySetInnerHTML={ { __html: htmlTester } }
		/>
	) )
	.add( 'Content', () => (
		<Content
			html={ htmlTester }
		/>
	) );

storiesOf( 'Components', module )
	.addDecorator( withStore( {} ) )
	.addDecorator( withCentering() )
	.add( 'Avatar', () => (
		<Avatar
			size={ 32 }
			url="https://secure.gravatar.com/avatar/0ceb885cc3d306af93c9764b2936d618?s=300&d=mm&r=g"
		/>
	) );
