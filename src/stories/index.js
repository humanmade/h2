import { storiesOf } from '@storybook/react';
import React from 'react';

import { htmlTester } from './stubs';
import { withPadding } from './decorators';
import { Content } from '../components/Message/Content';

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
