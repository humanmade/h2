import React from 'react';
import { Sidebar } from './Sidebar';

import { withCentering } from '../stories/decorators';
import { apiResponse } from '../stories/util';

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
