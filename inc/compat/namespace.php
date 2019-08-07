<?php

namespace H2\Compat;

use GFCommon;
use GFFormsModel;
use GFFormDisplay;

/**
 * Bootstrap compatibility support helpers.
 */
function bootstrap() {
	bootstrap_gravityforms();
}

/**
 * Bootstrap Gravity Forms support.
 */
function bootstrap_gravityforms() {
	if ( ! class_exists( '\\GFCommon' ) ) {
		return;
	}

	add_action( 'parse_request', __NAMESPACE__ . '\\handle_gravityform_request' );
	add_filter( 'gform_shortcode_form', __NAMESPACE__ . '\\filter_gravityform_shortcode', 10, 2 );
}

/**
 * Filter the [gravityform] shortcode to replace with an iframe.
 *
 * @param string $html HTML generated by Gravity Forms
 * @param array $attributes Attributes passed to the shortcode
 */
function filter_gravityform_shortcode( $html, $attributes ) {
	$attrs = shortcode_atts(
		[
			'id' => 0,
			'title' => 'true',
			'description' => 'true',
		],
		$attributes,
		'gravityforms'
	);

	$url = add_query_arg( 'h2_gravityform', absint( $attrs['id'] ), home_url() );
	if ( $attrs['title'] === 'true' ) {
		$url = add_query_arg( 'title', '1', $url );
	}
	if ( $attrs['description'] === 'true' ) {
		$url = add_query_arg( 'description', '1', $url );
	}

	$url = add_query_arg( '_wpnonce', wp_create_nonce( 'h2_gravityform:' . $attrs['id' ] ), $url );

	return sprintf(
		'<iframe src="%s" width="100%%" height="500" frameborder="0" scrolling="no" class="gfiframe"></iframe>',
		esc_url( $url )
	);
}

/**
 * Handle a Gravity Form request
 */
function handle_gravityform_request() {
	if ( empty( $_GET['h2_gravityform'] ) ) {
		return;
	}

	$id = absint( wp_unslash( $_GET['h2_gravityform'] ) );
	$nonce = wp_unslash( $_GET['_wpnonce'] ?? '' );
	if ( empty( $nonce ) || ! wp_verify_nonce( $nonce, 'h2_gravityform:' . $id ) ) {
		wp_die( 'Invalid nonce.' );
	}

	$options = [
		'title' => (bool) isset( $_GET['title'] ) ? wp_unslash( $_GET['title'] ) : false,
		'description' => (bool) isset( $_GET['description'] ) ? wp_unslash( $_GET['description'] ) : false,
	];

	render_gravityform( $id, $options );
	exit;
}

/**
 * Render a Gravity Form.
 *
 * @param int $id Form ID
 * @param array $options Form options for embedding
 */
function render_gravityform( int $id, array $options ) {
	add_filter( 'show_admin_bar', '__return_false', 100 );

	require_once( GFCommon::get_base_path() . '/form_display.php' );

	$form = GFFormsModel::get_form_meta( $id );

	echo '<!DOCTYPE html><html><head><meta charset="utf-8">';
	printf( '<title>%s</title>', esc_html( $form['title'] ) );
	wp_head();
	do_action( 'gfiframe_head', $id, $form );

	echo '</head><body><div class="PostContent">';

	GFFormDisplay::print_form_scripts( $form, false );
	gravity_form( $id, $options['title'], $options['description'] );
	wp_footer();

	echo '</div></body></html>';
}
