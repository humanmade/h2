const { presets, helpers, plugins } = require( '@humanmade/webpack-helpers' );

const { filePath, addFilter } = helpers;

// Do not compile sass, nor run eslint on build.
addFilter( 'loader/eslint', () => null );
addFilter( 'loader/postcss', () => null );
addFilter( 'loader/sass', () => null );

module.exports = presets.production( {
	devtool: 'source-map',
	optimization: {
		usedExports: true,
	},
	entry: {
		h2: filePath( 'src/index.js' ),
	},
    plugins: [
        plugins.clean(),
    ],
} );

console.log( module.exports.optimization );
