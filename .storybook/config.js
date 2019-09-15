import { addDecorator, configure } from '@storybook/react';

import rootDecorator from '../src/stories/root-decorator';

function loadStories() {
	addDecorator( rootDecorator() );

	const req = require.context( '../src/stories', true, /\.js$/ );
	req.keys().forEach( filename => req( filename ) );

	const newStories = require.context( '../src/components', true, /\.stories\.js$/ );
	return newStories.keys().map( filename => newStories( filename ) );
}

if ( process.env.STORYBOOK_MAPBOX_KEY ) {
	window.H2Data.site.mapbox_key = process.env.STORYBOOK_MAPBOX_KEY;
}

configure(loadStories, module);
