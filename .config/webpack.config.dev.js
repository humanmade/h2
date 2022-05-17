const { presets, helpers } = require( '@humanmade/webpack-helpers' );

const { filePath, addFilter, choosePort, cleanOnExit } = helpers;

// Do not compile sass, nor run eslint on build.
addFilter( 'loader/eslint', () => null );
addFilter( 'loader/postcss', () => null );
addFilter( 'loader/sass', () => null );

// Remove dev manifest when server closes so that theme will switch back to
// load using the production manifest.
cleanOnExit( [
	filePath( 'build/development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( port => presets.development( {
	devServer: {
		host: 'localhost',
		server: 'https', // Needed for HMR socket connection.
		port,
	},
	entry: {
		h2: filePath( 'src/index.js' ),
	},
} ) );
