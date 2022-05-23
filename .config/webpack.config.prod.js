const webpack = require( 'webpack' );
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
		filename: '[name].[contenthash].js',
		chunkFilename: 'h2.chunk-[id].[contenthash].js',
	},
	plugins: [
		plugins.clean(),
		plugins.fixStyleOnlyEntries(),
		new webpack.optimize.MinChunkSizePlugin( {
			minChunkSize: 50000,
		} ),
	],
	resolve: {
		alias: {
			'juniper-images': filePath( 'src/pattern-library/assets/images' ),
		},
	},
} );
