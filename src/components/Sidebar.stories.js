import React from 'react';

import { withCentering } from '../stories/decorators';
import { apiResponse } from '../stories/util';

import { Sidebar } from './Sidebar';

export default {
	title: 'Interface/Sidebar',
	decorators: [
		withCentering( { width: '30vw' } ),
	],
};

const commonProps = {
	widgets: [],
};

const htmlWidget = {
	id: 'custom-html-1',
	type: 'html',
	html: '<p>Raw HTML widget.</p>',
};

const titledWidget = {
	id: 'custom-html-2',
	type: 'custom_html',
	html: '<h4 class="widgettitle">Useful links</h4><p><a href="https://humanmade.com/">Human Made</a></p>',
};

export const Empty = () => (
	<Sidebar
		{ ...commonProps }
	/>
);

export const Basic = () => (
	<Sidebar
		widgets={ apiResponse( [ htmlWidget, titledWidget ] ) }
	/>
);
