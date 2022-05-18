const { presets, helpers, plugins } = require( '@humanmade/webpack-helpers' );

const devServerEditorStylesConfig = require( './dev-server-editor-styles' );

const { filePath, choosePort, cleanOnExit } = helpers;

// Remove dev manifest when server closes so that theme will switch back to
// load using the production manifest.
cleanOnExit( [
	filePath( 'build/development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( port => [
	presets.development( {
        entry: {
			h2: filePath( 'src/index.js' ),
			// Serve editor styles separately in DevServer.
        },
        output: {
            // Use 16-character hashes so Asset Loader recognizes filenames are already hashed.
            filename: '[name].[contenthash:16].js',
        },
		devServer: {
			host: 'localhost',
			port,
			devMiddleware: {
				// Write the editor style bundle to disk (see devServerEditorialStylesConfig).
				writeToDisk: filepath => /editor-style.*css/.test( filepath ),
			},
		},
		plugins: [
			plugins.miniCssExtract(),
		],
	} ),
	// Custom config to export editor styles to disk while running the DevServer.
	devServerEditorStylesConfig,
] );
