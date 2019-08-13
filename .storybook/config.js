import { addDecorator, configure } from '@storybook/react';

import rootDecorator from '../src/stories/root-decorator';

function loadStories() {
	addDecorator( rootDecorator() );

	const req = require.context( '../src/stories', true, /\.js$/ );
	req.keys().forEach( filename => req( filename ) );
}

configure(loadStories, module);
