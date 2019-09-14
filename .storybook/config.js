import { addDecorator, configure } from '@storybook/react';

import rootDecorator from '../src/stories/root-decorator';

function loadStories() {
	addDecorator( rootDecorator() );

	// Load base styles.
	require( '../src/pattern-lib/normalize.css' );
	require( '../src/pattern-lib/core.css' );
	require( '../src/pattern-lib/forms.css' );

	const req = require.context( '../src/stories', true, /\.js$/ );
	req.keys().forEach( filename => req( filename ) );
}

if ( process.env.STORYBOOK_MAPBOX_KEY ) {
	window.H2Data.site.mapbox_key = process.env.STORYBOOK_MAPBOX_KEY;
}

configure(loadStories, module);
