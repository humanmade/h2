<?php

namespace H2\Emoji;

use WP_Error;

const API_URL = 'https://slack.com/api/emoji.list';
const CACHE_GROUP = 'h2-global';
const SLACK_CACHE_KEY = 'slack-emoji';

/**
 * Set up emoji hooks
 */
function bootstrap() {
	if ( ! defined( 'HM_SLACK_BOT_TOKEN' ) ) {
		return;
	}

	wp_cache_add_global_groups( CACHE_GROUP );

	add_filter( 'h2.custom_emoji', __NAMESPACE__ . '\\get_custom_emoji' );
	add_action( 'h2.emoji.update_slack', __NAMESPACE__ . '\\update_slack_emoji' );
}

/**
 * Schedule cache updates on cron
 */
function schedule_updates() {
	if ( ! wp_next_scheduled( 'h2.emoji.update_slack' ) ) {
		wp_schedule_event( time(), 'hourly', 'h2.emoji.update_slack' );
	}
}

/**
 * Get custom emoji, formatted for Emoji Mart
 *
 * @return array List of emoji objects
 */
function get_custom_emoji( $emoji ) {
	$slack = get_slack_emoji();
	if ( empty( $slack ) || is_wp_error( $slack ) ) {
		return $emoji;
	}

	$custom = [];
	foreach ( $slack as $key => $url ) {
		// Set aliases as short_names
		if ( strpos( $url, 'alias:' ) === 0 ) {
			$original = (string) substr( $url, 6 );
			if ( isset( $custom[ $original ] ) ) {
				$custom[ $original ]['short_names'][] = (string) $key;
			}
			continue;
		}

		$custom[ (string) $key ] = [
			'name'        => (string) $key,
			'colons'      => sprintf( ':%s:', $key ),
			'short_names' => [
				(string) $key,
			],
			'text'        => '',
			'emoticons'   => [],
			'keywords'    => ['slack'],
			'imageUrl'    => $url,
		];
	}

	return array_merge( $emoji, array_values( $custom ) );
}

/**
 * Get custom emoji from Slack
 *
 * Uses the cache if available.
 *
 * @return array|WP_Error List of emoji from Slack if available, error otherwise
 */
function get_slack_emoji() {
	$data = wp_cache_get( SLACK_CACHE_KEY, CACHE_GROUP );

	if ( empty( $data ) ) {
		$data = fetch_slack_emoji();
		if ( is_wp_error( $data ) ) {
			return $data;
		}

		wp_cache_set( SLACK_CACHE_KEY, $data, CACHE_GROUP );
	}

	return $data;
}

/**
 * Fetch custom emoji from Slack
 */
function fetch_slack_emoji() {
	$url = add_query_arg( 'token', urlencode( HM_SLACK_BOT_TOKEN ), API_URL );

	$response = wp_remote_get( $url );
	if ( is_wp_error( $response ) ) {
		return $response;
	}

	if ( wp_remote_retrieve_response_code( $response ) !== 200 ) {
		return new WP_Error(
			'h2.emoji.fetch_slack_emoji.failed',
			sprintf( 'Slack API returned a %d response', wp_remote_retrieve_response_code( $response ) ),
			compact( 'response' )
		);
	}

	$body = wp_remote_retrieve_body( $response );
	$data = json_decode( $body );
	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return new WP_Error(
			'h2.emoji.fetch_slack_emoji.parse_error',
			'Unable to parse response from Slack',
			compact( 'body', 'response' )
		);
	}

	return (array) $data->emoji;
}
