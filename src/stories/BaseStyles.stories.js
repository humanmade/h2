import React from 'react';

import { Content as MessageContent } from '../components/Message/Content';

import { withPadding } from './decorators';
import { htmlTester } from './stubs';

export default {
	title: 'Components/Base Styles',
	decorators: [ withPadding() ],
};

export const Elements = () => (
	<div dangerouslySetInnerHTML={ { __html: htmlTester } } />
);

export const Content = () => <MessageContent html={ htmlTester } />;
