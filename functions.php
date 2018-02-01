<?php

namespace H2;

use ReactWPScripts;

require __DIR__ . '/wp-scripts-loader.php';
require __DIR__ . '/inc/rest-api/class-widgets-controller.php';

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
add_filter( 'pre_option_permalink_structure', __NAMESPACE__ . '\\get_permalink_structure' );
add_action( 'init', __NAMESPACE__ . '\\update_wp_rewrite_permalink_structure' );
add_action( 'rest_api_init', __NAMESPACE__ . '\\register_rest_routes' );

show_admin_bar( false );
add_theme_support( 'title-tag' );

register_sidebar( [
	'id' => 'sidebar',
	'name' => 'Sidebar',
	'before_title'  => '<h4 class="widgettitle">',
	'after_title'   => '</h4>',
] );

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

/**
 * Override the permalink structure, as it's hard-set in the React app.
 */
function get_permalink_structure( $current_value ) : string {
	return '/%year%/%monthnum%/%day%/%postname%/';
}

/**
 * Hardcoding a permastruct requires a workaround. Speficically WP_Rewrite
 * internally caches the value of get_option( 'permalink_structure' ), so we
 * have to reset it once out option override has bee set.
 */
function update_wp_rewrite_permalink_structure() {
	global $wp_rewrite;
	$wp_rewrite->permalink_structure = get_option( 'permalink_structure' );
}

function register_rest_routes() {
	/**
	 * @type WP_Widget_Factory $wp_widget_factory
	 */
	global $wp_widget_factory;

	$widgets_controller = new REST_API\Widgets_Controller( $wp_widget_factory->widgets );
	$widgets_controller->register_routes();
}
