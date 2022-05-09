<?php
/**
 * Control and enhance emoji support in H2.
 */

namespace H2\Emoji;

use WP_Error;

const API_URL         = 'https://slack.com/api/emoji.list';
const CACHE_GROUP     = 'h2-global';
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
	add_filter( 'the_content', __NAMESPACE__ . '\\replace_custom_emoji', 20 );
	add_filter( 'comment_text', __NAMESPACE__ . '\\replace_custom_emoji', 20 );
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
 * @param array $emoji Array of emoji.
 * @return array List of emoji objects
 */
function get_custom_emoji( $emoji ) {
	$slack = get_slack_emoji();
	if ( empty( $slack ) || is_wp_error( $slack ) ) {
		return $emoji;
	}

	$custom = [];
	foreach ( $slack as $key => $url ) {
		// Set aliases as short_names.
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
			'keywords'    => [
				'slack',
			],
			'imageUrl'    => $url,
		];
	}

	return array_merge( $emoji, $custom );
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
	$url = add_query_arg( 'token', rawurlencode( HM_SLACK_BOT_TOKEN ), API_URL );

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

/**
 * Get the URL for a particular emoji
 *
 * Resolves aliased URLs.
 *
 * @param string $type Emoji type (i.e. `shipit`)
 * @return string|null URL if found, null otherwise
 */
function get_url_for_slack_emoji( string $type ) {
	$emoji = get_slack_emoji();
	if ( empty( $emoji[ $type ] ) ) {
		return null;
	}

	$url = $emoji[ $type ];
	if ( strpos( $url, 'alias:' ) === 0 ) {
		return get_url_for_slack_emoji( substr( $url, 6 ) );
	}

	return $url;
}

/**
 * Replace custom emoji in post content
 *
 * Based on convert_smilies() from WordPress core.
 *
 * @param string $content Original post content
 * @return string Modified post content
 */
function replace_custom_emoji( $content ) {
	$emoji  = get_slack_emoji();
	$search = '#:(' . join( '|', array_map( 'preg_quote', array_keys( $emoji ) ) ) . '):#';

	// HTML loop taken from texturize function, could possible be consolidated.
	$textarr = preg_split( '/(<.*>)/U', $content, -1, PREG_SPLIT_DELIM_CAPTURE ); // capture the tags as well as in between.
	$stop    = count( $textarr ); // loop stuff.

	// Ignore proessing of specific tags.
	$tags_to_ignore       = 'code|pre|style|script|textarea';
	$ignore_block_element = '';

	$output = '';
	foreach ( $textarr as $content ) {
		// If we're in an ignore block, wait until we find its closing tag.
		if ( '' === $ignore_block_element && preg_match( '/^<(' . $tags_to_ignore . ')>/', $content, $matches ) ) {
			$ignore_block_element = $matches[1];
		}

		// If it's not a tag and not in ignore block.
		if ( '' === $ignore_block_element && strlen( $content ) > 0 && '<' !== $content[0] ) {
			$content = preg_replace_callback(
				$search,
				function ( $matches ) {
					if ( count( $matches ) === 0 ) {
						return '';
					}

					$type    = trim( $matches[1] );
					$src_url = get_url_for_slack_emoji( $type );

					if ( empty( $src_url ) ) {
						return $matches[0];
					}

					return sprintf(
						'<img src="%1$s" alt="%2$s" title="%2$s" class="wp-smiley" style="height: 1em; max-height: 1em;" />',
						esc_url( $src_url ),
						esc_attr( $type )
					);
				},
				$content
			);
		}

		// did we exit ignore block.
		if ( '' !== $ignore_block_element && '</' . $ignore_block_element . '>' === $content ) {
			$ignore_block_element = '';
		}

		$output .= $content;
	}

	return $output;
}
