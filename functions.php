<?php
/**
 * Theme functions file. Requires files from inc/ and bootstraps the theme.
 */

namespace H2;

require __DIR__ . '/inc/namespace.php';
require __DIR__ . '/inc/compat/namespace.php';
require __DIR__ . '/inc/emoji/namespace.php';
require __DIR__ . '/inc/loader/namespace.php';
require __DIR__ . '/inc/rest_api/class-widgets-controller.php';

add_action( 'after_setup_theme', __NAMESPACE__ . '\\adjust_default_filters' );
add_action( 'after_setup_theme', __NAMESPACE__ . '\\set_up_theme' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
add_filter( 'pre_option_permalink_structure', __NAMESPACE__ . '\\get_permalink_structure' );
add_action( 'init', __NAMESPACE__ . '\\update_wp_rewrite_permalink_structure' );
add_action( 'init', __NAMESPACE__ . '\\register_custom_meta' );
add_action( 'rest_api_init', __NAMESPACE__ . '\\register_rest_routes' );
add_filter( 'rest_user_collection_params', __NAMESPACE__ . '\\increase_api_user_limit' );

Compat\bootstrap();
Emoji\bootstrap();
