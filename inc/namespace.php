<?php
/**
 * Key theme logic.
 */

namespace H2;

use WP_Error;
use WP_REST_Request;

/**
 * Adjust default filters in WordPress.
 *
 * Adds and removes default filters and callbacks from various formatting
 * filters.
 */
function adjust_default_filters() {
	// Add make_clickable to posts.
	add_filter( 'the_content', 'make_clickable', 9 );

	// Normalize entities for easier decoding.
	add_filter( 'the_title', 'ent2ncr', 11 );

	// Render embeds in comments.
	global $wp_embed;
	add_filter( 'comment_text', [ $wp_embed, 'run_shortcode' ], 8 );
	add_filter( 'comment_text', [ $wp_embed, 'autoembed' ], 8 );
}

/**
 * Set up theme global settings.
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
 * Enqueue frontend CSS and JS.
 */
function enqueue_assets() {
	Loader\enqueue_assets( get_stylesheet_directory() );
	wp_localize_script( 'h2', 'wpApiSettings', [
		'root'          => esc_url_raw( get_rest_url() ),
		'nonce'         => ( wp_installing() && ! is_multisite() ) ? '' : wp_create_nonce( 'wp_rest' ),
	] );
	wp_localize_script( 'h2', 'H2Data', get_script_data() );

	if ( defined( 'H2_TYPEKIT_URL' ) ) {
		wp_enqueue_style( 'h2-fonts', H2_TYPEKIT_URL );
	}
}

/**
 * Gather data for H2.
 */
function get_script_data() {
	$preload = [
		'/wp/v2/posts',
		'/h2/v1/site-switcher/sites',
		'/h2/v1/widgets?sidebar=sidebar',
		'/wp/v2/categories?per_page=100',
		'/wp/v2/users/me',
		'/wp/v2/users?per_page=100',
	];

	$data = [
		'asset_url' => get_theme_file_uri( 'build/' ),
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
			'sentry_key'     => defined( 'H2_SENTRY_KEY' ) ? H2_SENTRY_KEY : null,
			'environment'    => defined( 'HM_ENV_TYPE' ) ? HM_ENV_TYPE : ( WP_DEBUG ? 'development' : 'production' ),
			'emoji'          => apply_filters( 'h2.custom_emoji', [] ),
		],
		'features' => [
			'interweave' => (bool) get_site_option( 'h2_use_interweave', false ),
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

/**
 * Trigger anticipatory requests against the REST server for a list of URLs.
 *
 * @param string[] $urls List of REST endpoint URLs.
 * @return array Array of returned data for each requested endpoint.
 */
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
 *
 * @param string $current_value Whatever permalink scheme is set (overridden).
 * @return string A permalink structure that matches the React router.
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

/**
 * Register H2-specific REST endpoints.
 *
 * @return void
 */
function register_rest_routes() {
	/**
	 * Global WP widget factory.
	 *
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

	// Add permissions to objects.
	register_rest_field( 'comment', 'user_can', [
		'get_callback' => function ( $data ) {
			$current_user = get_current_user_id();
			$comment = get_comment( $data['id'] );
			return [
				'edit' => current_user_can( 'moderate_comments' ) || $current_user === (int) $comment->user_id,
			];
		},
	] );

	register_rest_route( 'h2', 'v1/preview', [
		'methods' => 'POST',
		'callback' => __NAMESPACE__ . '\\render_preview',
		'args' => [
			'html' => [
				'type' => 'text',
				'required' => true,
			],
			'type' => [
				'type' => 'string',
				'required' => true,
				'default' => 'post',
				'enum' => [
					'post',
					'comment',
				],
			],
		],
	] );
}

/**
 * Register custom metadata.
 */
function register_custom_meta() {
	register_meta( 'user', 'h2_view_preference', [
		'single'            => true,
		'show_in_rest'      => true,
		'default'           => 'full',
		'sanitize_callback' => function ( string $value ) : string {
			$value = strtolower( $value );
			if ( ! in_array( $value, [ 'compact', 'nocomments', 'full' ], true ) ) {
				return 'full';
			}
			return $value;
		},
	] );
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
function add_word_count_to_api( $response ) {
	$data = $response->get_data();

	// Skip contexts without any content.
	if ( empty( $data['content'] ) ) {
		return $response;
	}

	// Convert HTML to text.
	$text = wp_strip_all_tags( $data['content']['rendered'] );
	$text = wp_kses_decode_entities( ent2ncr( $text ) );

	// Add word count.
	$data['content']['count'] = str_word_count( $text );

	$response->set_data( $data );
	return $response;
}

/**
 * Render HTML preview text as content.
 *
 * Applies `the_content` filter to arbitrary input text to enable more accurate
 * previews of the final output while editing.
 *
 * @param WP_REST_Request $request Full details about the request.
 * @return array
 */
function render_preview( WP_REST_Request $request ) {
	switch ( $request['type'] ) {
		case 'post':
			$content = apply_filters( 'the_content', $request['html'] );
			break;

		case 'comment':
			$content = apply_filters( 'comment_text', $request['html'], null );
			break;

		default:
			return new WP_Error( 'h2_preview_invalid_type', 'Invalid preview type' );
	}

	return [
		'type' => $request['type'],
		'html' => $content,
	];
}
