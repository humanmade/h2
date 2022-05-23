const { presets, helpers } = require( '@humanmade/webpack-helpers' );

const { filePath, choosePort, cleanOnExit } = helpers;

// Remove dev manifest when server closes so that theme will switch back to
// the production manifest, if available.
cleanOnExit( [
	filePath( 'build/development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( port => presets.development( {
	devServer: {
		host: 'localhost',
		port,
	},
	entry: {
		h2: filePath( 'src/index.js' ),
		// Editor styles require the production build.
	},
	output: {
		filename: '[name].[hash].js',
		chunkFilename: '[name].chunk.[hash].js',
	},
	resolve: {
		alias: {
			'juniper-images': filePath( 'src/pattern-library/assets/images' ),
		},
	},
} ) );
