/**
 * Load the built-in plugins.
 */

import Reactions from './reactions';
import registerSentry from './sentry';

export default function loadPlugins() {
	registerSentry();

	if ( window.H2Data.plugins.reactions ) {
		window.H2.plugins.register( Reactions );
	}
}
