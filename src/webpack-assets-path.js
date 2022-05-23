// Set the asset path dynamically to the theme directory.
if ( process.env.NODE_ENV === 'production' ) {
	// eslint-disable-next-line no-undef
	__webpack_public_path__ = window.H2Data.asset_url;
}
