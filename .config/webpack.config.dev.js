const glob = require( 'glob' );
const { presets, helpers } = require( '@humanmade/webpack-helpers' );

const { filePath, choosePort, cleanOnExit, addFilter } = helpers;

// Split CSS and SCSS handling so plain CSS files skip sass-loader.
// Tailwind v4 uses @import 'tailwindcss' which sass-loader cannot process.
addFilter( 'presets/stylesheet-loaders', ( rule ) => {
	const useWithoutSass = rule.use.slice( 0, -1 );
	console.log( useWithoutSass );
	return {
		test: /\.s?css$/,
		oneOf: [
			{ resourceQuery: /raw/, type: 'asset/source' },
			{
				resourceQuery: /inline/,
				type: 'asset/source',
				use: rule.use.slice( 2 ), // postcss-loader + sass-loader
			},
			{ test: /\.css$/, use: useWithoutSass },
			{ test: /\.scss$/, use: rule.use },
		],
	};
} );

// Add Tailwind CSS to PostCSS plugins
addFilter( 'loaders/postcss/plugins', plugins => {
	return [
		require( '@tailwindcss/postcss' ),
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

// Remove dev manifest when server closes so that theme will switch back to
// the production manifest, if available.
cleanOnExit( [
	filePath( 'build/development-asset-manifest.json' ),
] );

module.exports = choosePort( 9090 ).then( port => {
	const config = presets.development( {
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
				'juniper-images': filePath( 'src/assets/images' ),

				// format-library's package exports omit its stylesheet.
				'@wordpress/format-library/build-style': filePath( 'node_modules/@wordpress/format-library/build-style' ),
			},
		},
		plugins: [
			new WatchContentFilesPlugin(),
		],
	} );

	// Allow non-fully-specified imports from packages like `diff` used by
	// @wordpress/block-editor (webpack 5 strict ESM compatibility).
	config.module.rules.unshift( {
		test: /\.m?js/,
		resolve: { fullySpecified: false },
	} );

	return config;
} );
