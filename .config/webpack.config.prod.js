const { helpers, presets, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath } = helpers;

module.exports = presets.production( {
	entry: {
		h2: filePath( 'src/index.js' ),
		'editor-style': filePath( 'src/editor-style.scss' ),
	},
	output: {
		// Use 16-character hashes so Asset Loader recognizes filenames are already hashed.
		filename: '[name].[contenthash:16].js',
	},
	optimization: {
		usedExports: true,
	},
    plugins: [
        plugins.clean(),
    ],
} );
