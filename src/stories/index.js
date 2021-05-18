import { storiesOf } from '@storybook/react';
import React from 'react';

import { Content } from '../components/Message/Content';

import { withPadding } from './decorators';
import { htmlTester } from './stubs';

import '../hm-pattern-library/assets/styles/juniper.css';

storiesOf( 'Components|Base Styles', module )
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
