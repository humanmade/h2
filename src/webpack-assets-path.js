/* eslint-disable no-undef */
// Set the asset path dynamically to the theme directory.
if ( process.env.NODE_ENV === 'production' || ! __webpack_public_path__ ) {
	__webpack_public_path__ = window.H2Data.asset_url;
}
