import { storiesOf } from '@storybook/react';
import React from 'react';

import { htmlTester } from './stubs';
import { withPadding } from './decorators';
import { Content } from '../components/Message/Content';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Components|Base Styles' )
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
