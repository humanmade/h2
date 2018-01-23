<?php

namespace H2;

use ReactWPScripts;

require __DIR__ . '/wp-scripts-loader.php';

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
add_filter( 'reactwpscripts.is_development', '__return_true' );
show_admin_bar( false );

function enqueue_assets() {
	wp_enqueue_script( 'caret', 'https://cdnjs.cloudflare.com/ajax/libs/Caret.js/0.3.1/jquery.caret.min.js', [ 'jquery' ] );
	wp_enqueue_script( 'atwho', 'https://cdnjs.cloudflare.com/ajax/libs/at.js/1.5.4/js/jquery.atwho.min.js', [ 'jquery' ] );
	wp_enqueue_style( 'atwho', 'https://cdnjs.cloudflare.com/ajax/libs/at.js/1.5.4/css/jquery.atwho.min.css' );
	ReactWPScripts\enqueue_assets( get_stylesheet_directory() );
	wp_localize_script( 'h2', 'wpApiSettings', array(
		'root'          => esc_url_raw( get_rest_url() ),
		'nonce'         => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
	) );
}
