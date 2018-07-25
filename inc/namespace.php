<?php

namespace H2;

use WP_REST_Request;

/**
 * Set up theme global settings
 */
function set_up_theme() {
	add_theme_support( 'title-tag' );

	register_sidebar( [
		'id' => 'sidebar',
		'name' => 'Sidebar',
		'before_title'  => '<h4 class="widgettitle">',
		'after_title'   => '</h4>',
		'before_widget' => '',
		'after_widget'  => '',
	] );
}

/**
 * Enqueue frontend CSS and JS
 */
function enqueue_assets() {
	Loader\enqueue_assets( get_stylesheet_directory() );
	wp_localize_script( 'h2', 'wpApiSettings', [
		'root'          => esc_url_raw( get_rest_url() ),
		'nonce'         => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
	] );
	wp_localize_script( 'h2', 'H2Data', get_script_data() );
}

/**
 * Gather data for H2
 */
function get_script_data() {
	$preload = [
		'/wp/v2/posts',
		'/h2/v1/site-switcher/sites',
		'/h2/v1/widgets?sidebar=sidebar',
		'/wp/v2/users/me',
		'/wp/v2/users?per_page=100',
	];

	$data = [
		'site' => [
			'name'           => get_bloginfo( 'name' ),
			'url'            => site_url(),
			'home'           => home_url(),
			'api'            => rest_url(),
			'nonce'          => wp_create_nonce( 'wp_rest' ),
			'default_avatar' => get_avatar_url( 0, [
				'force_default' => true,
			] ),
			'mapbox_key'     => defined( 'MAPBOX_KEY' ) ? MAPBOX_KEY : null,
			'emoji'          => apply_filters( 'h2.custom_emoji', [] ),
		],
		'plugins' => [
			'reactions' => \class_exists( 'H2\\Reactions\\Reaction' ),
		],
		'preload' => prefetch_urls( $preload ),
	];

	// Preload the comments and reactions for the posts too.
	if ( isset( $data['preload']['/wp/v2/posts'] ) ) {
		foreach ( $data['preload']['/wp/v2/posts'] as $post_data ) {
			$id   = $post_data['id'];
			$urls = [
				sprintf( '/h2/v1/reactions?post=%d', $post_data['id'] ),
				sprintf( '/wp/v2/comments?post=%d&per_page=100', $post_data['id'] ),
				sprintf( '/wp/v2/users/%d', $post_data['author'] ),
				sprintf( '/wp/v2/categories?include=%s', implode( ',', $post_data['categories'] ) ),
			];

			// Only fetch new URLs we don't already have.
			$urls = array_filter( $urls, function ( $url ) use ( $data ) {
				return empty( $data['preload'][ $url ] );
			} );

			$results         = prefetch_urls( $urls );
			$data['preload'] = array_merge( $data['preload'], $results );
		}
	}

	return $data;
}

function prefetch_urls( $urls ) {
	$server = rest_get_server();
	$data   = [];
	foreach ( $urls as $url ) {
		$request  = WP_REST_Request::from_url( rest_url( $url ) );
		$response = rest_do_request( $request );
		if ( $response->is_error() ) {
			continue;
		}

		$data[ $url ] = $server->response_to_data( $response, false );
	}
	return $data;
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

	add_filter( 'rest_prepare_post', __NAMESPACE__ . '\\add_word_count_to_api' );

	$markdown_schema = [
		'description' => 'Raw Markdown content for the post.',
		'type'        => 'string',
		'context'     => [ 'edit' ],
	];

	register_rest_field( 'post', 'unprocessed_content', [
		'get_callback'    => function ( $data, $attr, $request ) {
			if ( $request['context'] !== 'edit' ) {
				return null;
			}

			return get_post_meta( $data['id'], 'unprocessed_content', true );
		},
		'update_callback' => function ( $value, $post ) {
			update_post_meta( $post->ID, 'unprocessed_content', wp_slash( $value ) );
		},
		'schema'          => $markdown_schema,
	] );
	register_rest_field( 'comment', 'unprocessed_content', [
		'get_callback'    => function ( $data, $attr, $request ) {
			if ( $request['context'] !== 'edit' ) {
				return null;
			}

			return get_comment_meta( $data['id'], 'unprocessed_content', true );
		},
		'update_callback' => function ( $value, $comment ) {
			update_comment_meta( $comment->comment_ID, 'unprocessed_content', wp_slash( $value ) );
		},
		'schema'          => $markdown_schema,
	] );
}

/**
 * Register custom metadata.
 */
function register_custom_meta() {
	register_meta( 'user', 'h2_last_updated', [
		'single'       => true,
		'show_in_rest' => true,
	] );
	register_meta( 'user', 'hm_time_timezone', [
		'single'       => true,
		'show_in_rest' => true,
	] );

	// These fields are exposed above.
	register_meta( 'post', 'unprocessed_content', [
		'show_in_rest' => false,
		'single'       => true,
	] );
	register_meta( 'comment', 'unprocessed_content', [
		'show_in_rest' => false,
		'single'       => true,
	] );
}

/**
 * Add word count to REST API post responses.
 *
 * @param WP_REST_Response $response The response object.
 * @return WP_REST_Response
 */
function add_word_count_to_api( $response, $post ) {
	$data = $response->get_data();

	// Convert HTML to text.
	$text = wp_strip_all_tags( $data['content']['rendered'] );
	$text = wp_kses_decode_entities( ent2ncr( $text ) );

	// Add word count.
	$data['content']['count'] = str_word_count( $text );

	$response->set_data( $data );
	return $response;
}
