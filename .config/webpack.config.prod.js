const glob = require( 'glob' );
const webpack = require( 'webpack' );
const { helpers, presets, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath, addFilter } = helpers;

// Add Tailwind CSS to PostCSS plugins
addFilter( 'loaders/postcss/plugins', plugins => {
	return [
		require( 'tailwindcss' ),
		require( 'autoprefixer' ),
		...plugins,
	];
} );

// Custom plugin to watch PHP/HTML files for Tailwind class changes
class WatchContentFilesPlugin {
	apply( compiler ) {
		compiler.hooks.afterCompile.tap( 'WatchContentFilesPlugin', ( compilation ) => {
			// Get all PHP and HTML files that Tailwind should watch
			const patterns = [
				'./src/**/*.{js,jsx,ts,tsx}',
				'./index.php',
				'./inc/**/*.php',
			];

			patterns.forEach( pattern => {
				const files = glob.sync( pattern, { absolute: true } );
				files.forEach( file => {
					compilation.fileDependencies.add( file );
				} );
			} );
		} );
	}
}

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
		new WatchContentFilesPlugin(),
	],
	resolve: {
		alias: {
			'juniper-images': filePath( 'src/assets/images' ),
		},
	},
	cache: {
		// See https://webpack.js.org/guides/build-performance/#persistent-cache
		type: 'filesystem',
	},
} );
