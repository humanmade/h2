import { addDecorator, addParameters, configure } from '@storybook/react';

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

addParameters( {
	backgrounds: [
		{
			name: 'Checkerboard',
			value: `
				linear-gradient(45deg, #f3f3f3 25%, transparent 25%) 0 0 / 20px 20px,
				linear-gradient(-45deg, #f3f3f3 25%, transparent 25%) 0 10px / 20px 20px,
				linear-gradient(45deg, transparent 75%, #f3f3f3 75%) 10px -10px / 20px 20px,
				linear-gradient(-45deg, transparent 75%, #f3f3f3 75%) -10px 0px / 20px 20px
			`,
			default: true,
		},
		{ name: 'White', value: '#fff' },
		{ name: 'Black', value: '#000' },
	],
} );

configure(loadStories, module);
