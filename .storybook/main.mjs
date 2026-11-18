import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );

export default {
	framework: '@storybook/react-webpack5',
	stories: [ '../src/**/*.stories.js' ],
	staticDirs: [ '../public' ],
	addons: [ '@storybook/addon-webpack5-compiler-babel' ],
	webpackFinal: async config => {
		config.resolve.alias[ 'juniper-images' ] = path.join( root, 'src/assets/images' );
		// Use the theme's PostCSS pipeline for Tailwind, without passing it to Sass.
		for ( const rule of config.module.rules ) {
			if ( rule.test instanceof RegExp && rule.test.test( 'style.css' ) ) {
				rule.use = [ 'style-loader', 'css-loader', 'postcss-loader' ];
			}
		}
		config.module.rules.push( {
			test: /\.scss$/,
			use: [ 'style-loader', 'css-loader', 'sass-loader' ],
		} );
		return config;
	},
};
