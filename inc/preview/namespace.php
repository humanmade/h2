<?php

namespace HM\H2\Preview;

use WP_REST_Request;

add_action( 'rest_api_init', __NAMESPACE__ . '\\add_rest_routes' );

function add_rest_routes() {
	register_rest_route( 'h2', 'v1/preview', [
		'methods' => 'POST',
		'callback' => __NAMESPACE__ . '\\rest_callback',
		'args' => [
			'html' => [
				'type' => 'text',
				'required' => true,
			],
		],
	] );
}

function rest_callback( WP_REST_Request $request ) {
	return [
		'html' => apply_filters( 'the_content', $request['html'] ),
	];
}
