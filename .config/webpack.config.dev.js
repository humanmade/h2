const { presets, helpers } = require( '@humanmade/webpack-helpers' );

const { filePath, choosePort, cleanOnExit } = helpers;

// Remove dev manifest when server closes so that theme will switch back to
// the production manifest, if available.
cleanOnExit( [
	filePath( 'build/development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( port => presets.development( {
	entry: {
		h2: filePath( 'src/index.js' ),
		// Editor styles require the production build.
	},
	output: {
		// Asset Loader understands filenames are already hashed in this format.
		filename: '[name].[contenthash:16].js',
	},
	devServer: {
		host: 'localhost',
		port,
	},
} ) );
