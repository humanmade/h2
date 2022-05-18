const { presets, helpers, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath, addFilter, removeFilter } = helpers;

/**
 * Replace the Style Loader with the Extract CSS loader.
 *
 * @returns {string} Loader path.
 */
const useExtractCssLoader = () => plugins.constructors.MiniCssExtractPlugin.loader;
addFilter( 'loader/style', useExtractCssLoader );

// Custom config to export editor styles to disk while running the DevServer.
module.exports = presets.development( {
	name: 'editor-style',
	// Do not try to instantiate a second DevServer.
	devServer: undefined,
	entry: {
		'editor-style': filePath( 'src/editor-style.scss' ),
	},
	output: {
		// Use 16-character hashes so Asset Loader recognizes filenames are already hashed.
		filename: '[name].[contenthash:16].js',
		// This file will be loaded from disk, not localhost.
		publicPath: 'build/',
	},
	plugins: [
		plugins.miniCssExtract(),
	],
} );

// Restore normal style loading behavior.
removeFilter( 'loader/style', useExtractCssLoader );
