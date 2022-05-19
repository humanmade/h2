const { helpers, presets, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath } = helpers;

module.exports = presets.production( {
	optimization: {
		usedExports: true,
	},
	entry: {
		h2: filePath( 'src/index.js' ),
		'editor-style': filePath( 'src/editor-style.scss' ),
	},
	output: {
		// Asset Loader understands filenames are already hashed in this format.
		filename: '[name].[contenthash:16].js',
	},
    plugins: [
        plugins.clean(),
    ],
} );
