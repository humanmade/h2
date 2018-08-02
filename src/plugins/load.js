/**
 * Load the built-in plugins.
 */

import Reactions from './reactions';

export default function loadPlugins() {
	if ( window.H2Data.plugins.reactions ) {
		window.H2.plugins.register( Reactions );
	}
}
