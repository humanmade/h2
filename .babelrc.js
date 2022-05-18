/**
 * This Babel configuration is based on WordPress's default configuration,
 * modified to assume direct use of React instead of use via wp.createElement.
 *
 * For more information:
 * https://developer.wordpress.org/block-editor/reference-guides/packages/packages-babel-preset-default/
 */
const browserslist = require( 'browserslist' );

module.exports = ( api ) => {
    api.cache.forever();

    let localBrowserslist = browserslist.findConfig( '.' );

    return {
        presets: [
            [
                require.resolve( '@babel/preset-env' ),
                {
                    modules: 'auto',
                    include: [
                        'proposal-class-properties',
                        'proposal-nullish-coalescing-operator',
                        'proposal-logical-assignment-operators',
                    ],
                    targets: {
                        browsers: localBrowserslist ? localBrowserslist.defaults : [ 'defaults' ],
                    },
                },
            ]
        ],
        plugins: [
            require.resolve( '@wordpress/warning/babel-plugin' ),
            [ require.resolve( '@babel/plugin-transform-react-jsx' ) ],
            [
                require.resolve( '@babel/plugin-transform-runtime' ),
                {
                    helpers: true,
                }
            ],
        ],
    };
};
