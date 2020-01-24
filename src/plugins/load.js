/**
 * Load the built-in plugins.
 */

import Feedback from './feedback';
import Reactions from './reactions';
import registerSentry from './sentry';

export default function loadPlugins() {
	registerSentry();

	window.H2.plugins.register( Feedback );

	if ( window.H2Data.plugins.reactions ) {
		window.H2.plugins.register( Reactions );
	}
}
