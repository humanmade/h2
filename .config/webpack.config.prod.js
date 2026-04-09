const glob = require( 'glob' );
const webpack = require( 'webpack' );
const { helpers, presets, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath, addFilter } = helpers;

// Split CSS and SCSS handling so plain CSS files skip sass-loader.
// Tailwind v4 uses @import 'tailwindcss' which sass-loader cannot process.
addFilter( 'presets/stylesheet-loaders', ( rule ) => {
	const useWithoutSass = rule.use.slice( 0, -1 );
	console.log( rule.use, useWithoutSass );
	return {
		test: /\.s?css$/,
		oneOf: [
			{ test: /\.css$/, use: useWithoutSass },
			{ test: /\.scss$/, use: rule.use },
		],
	};
} );

// Add Tailwind CSS to PostCSS plugins
addFilter( 'loaders/postcss/plugins', plugins => {
	return [
		require( '@tailwindcss/postcss' ),
		require( 'postcss-nesting' ),
		// ...plugins,
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

// Remove CSS minimizer, as cssnano conflicts with Tailwind since it doesn't
// understand the nested syntax.
// (Remove this once webpack-helpers is updated to latest.)
module.exports.optimization.minimizer = module.exports.optimization.minimizer.filter( minimizer => {
	return minimizer.constructor.name !== 'CssMinimizerPlugin';
} );
