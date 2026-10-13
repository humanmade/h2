/**
 * Get the network the site belongs to, if any.
 *
 * `H2Data.network` is provided by the H2 Network plugin: unset when the plugin
 * isn't active, `false` on single-site installs, and otherwise an object
 * describing the network.
 *
 * @returns {object|null} Network data, or null when not part of a network.
 */
export function getNetwork() {
	return ( window.H2Data && window.H2Data.network ) || null;
}

/**
 * Normalise a URL for comparison.
 *
 * @param {string} url URL to normalise.
 * @returns {string} URL without scheme or trailing slashes.
 */
const normaliseUrl = url => ( url || '' ).replace( /^https?:\/\//, '' ).replace( /\/+$/, '' ).toLowerCase();

/**
 * Check whether a site from the network API is the site being viewed.
 *
 * @param {object} site Site data, with a `url`.
 * @returns {boolean} True if the site is the current one.
 */
export function isCurrentSite( site ) {
	return normaliseUrl( site.url ) === normaliseUrl( window.H2Data.site.home );
}

/**
 * Format a URL for display.
 *
 * @param {string} url Full URL.
 * @returns {string} URL without the scheme or trailing slash.
 */
export function displayUrl( url ) {
	return ( url || '' ).replace( /^https?:\/\//, '' ).replace( /\/+$/, '' );
}

/**
 * Get the text of an HTML string.
 *
 * The HTML is parsed into an inert document, so nothing in it is run or loaded.
 *
 * @param {string} html HTML to get the text of.
 * @returns {string} Text content.
 */
export function getPlainText( html ) {
	const doc = new DOMParser().parseFromString( html || '', 'text/html' );
	return ( doc.body.textContent || '' ).trim();
}

/**
 * Format a count of results.
 *
 * Elasticsearch stops counting at 10,000 results.
 *
 * @param {number} total Total results.
 * @returns {string} Formatted count.
 */
export function formatTotal( total ) {
	if ( total >= 10000 ) {
		return '10,000+ results';
	}

	return total === 1 ? '1 result' : `${ total.toLocaleString() } results`;
}
