const glob = require( 'glob' );
const { presets, helpers } = require( '@humanmade/webpack-helpers' );

const { filePath, choosePort, cleanOnExit, addFilter } = helpers;

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
			'juniper-images': filePath( 'src/assets/images' ),
		},
	},
	plugins: [
		new WatchContentFilesPlugin(),
	],
} ) );
