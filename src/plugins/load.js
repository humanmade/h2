/**
 * Load the built-in plugins.
 */

import Feedback from './feedback';
import Reactions from './reactions';

export default function loadPlugins() {
	window.H2.plugins.register( Feedback );

	if ( window.H2Data.plugins.reactions ) {
		window.H2.plugins.register( Reactions );
	}
}
