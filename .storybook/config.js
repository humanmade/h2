import { addDecorator, addParameters, configure } from '@storybook/react';

import rootDecorator from '../src/stories/root-decorator';

function loadStories() {
	addDecorator( rootDecorator() );

	const req = require.context( '../src/stories', true, /\.js$/ );
	req.keys().forEach( filename => req( filename ) );

	const newStories = require.context( '../src/components', true, /\.stories\.js$/ );
	return newStories.keys().map( filename => newStories( filename ) );
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

		{ name: 'red', value: '#D24632' },
		{ name: 'blue', value: '#7DC9DA' },
		{ name: 'warm-grey', value: '#504C4C' },
		{ name: 'dark-grey', value: '#353535' },
		{ name: 'beige', value: '#F4EFE6' },
		{ name: 'medium-grey', value: '#737373' },
		{ name: 'light-grey', value: '#f7f7f7' },
		{ name: 'brown', value: '#4F4641' },
		{ name: 'red-light', value: '#e06857' },
		{ name: 'red-dark', value: '#b34332' },
	],
} );

configure(loadStories, module);
