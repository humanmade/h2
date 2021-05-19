import React from 'react';

import { withCentering } from '../stories/decorators';
import { apiResponse } from '../stories/util';

import { Sidebar } from './Sidebar';

export default {
	title: 'Interface|Sidebar',
	decorators: [
		withCentering( { width: '30vw' } ),
	],
};

const commonProps = {
	widgets: [],
};

const htmlWidget = {
	type: 'html',
	html: '<p>Raw HTML widget.</p>',
};

export const Empty = () => (
	<Sidebar
		{ ...commonProps }
	/>
);

export const Basic = () => (
	<Sidebar
		widgets={ apiResponse( [ htmlWidget ] ) }
	/>
);
