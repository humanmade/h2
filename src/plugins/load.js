/**
 * Load the built-in plugins.
 */

import Reactions from './reactions';

export default function loadPlugins() {
	window.H2.plugins.register( Reactions );
}
