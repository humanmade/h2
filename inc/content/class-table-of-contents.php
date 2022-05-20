<?php
/**
 * Build a header hierarchy representation for each post and expose it via a
 * [toc] shortcode.
 */

namespace H2\Content;

/**
 * Add anchors to headings and register a table of contents shortcode.
 */
class Table_Of_Contents {
	/**
	 * Array of headings keyed by post ID.
	 *
	 * @var array[]
	 */
	private $headings_by_post = [];

	/**
	 * Table_Of_Contents constructor.
	 */
	public function __construct() {
		add_filter( 'the_content', [ $this, 'filter_ensure_header_ids' ], 9 );
		add_filter( 'the_content', [ $this, 'handle_markdown_toc_shortcode' ] );
		add_shortcode( 'toc', [ $this, 'toc_shortcode' ] );
	}

	/**
	 * Undocumented function
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string
	 */
	public function toc_shortcode( $atts ) : string {
		$headings = $this->get_heading_list( get_the_ID() );
		if ( empty( $headings ) ) {
			return '';
		}

		ob_start();
		echo '<ul class="ToC">';
		foreach ( $headings as $anchor ) {
			printf(
				'<li class="ToC__Item ToC__Item--Lv%d"><a href="%s">%s</a></li>',
				esc_attr( $anchor['level'] ),
				esc_url( '#' . $anchor['id'] ),
				wp_kses( $anchor['content'], [] )
			);
		}
		echo '</ul>';
		return (string) ob_get_clean();
	}

	/**
	 * Check whether we have already computed the heading tag anchor list for a post.
	 *
	 * @param int|bool $post_id ID of a post.
	 * @return bool Whether we have already computed heading tag anchors for this post.
	 */
	protected function has_heading_list( $post_id ) : bool {
		if ( ! is_int( $post_id ) || ! isset( $this->headings_by_post[ $post_id ] ) ) {
			return false;
		}
		return is_array( $this->headings_by_post[ $post_id ] ) && ! empty( $this->headings_by_post[ $post_id ] );
	}

	/**
	 * Store a heading tag anchor list for a specific post.
	 *
	 * @param int     $post_id  ID of post for which to save headings.
	 * @param array[] $headings Array of [ level, id ] heading tag representations.
	 */
	protected function set_heading_list( int $post_id, array $headings ) : void {
		$this->headings_by_post[ $post_id ] = $headings;
	}

	/**
	 * Retrieve the stored heading tag anchor list for a post.
	 *
	 * @param int|false $post_id ID of post for which to retrieve headings.
	 * @return array Heading anchor list.
	 */
	protected function get_heading_list( $post_id ) : array {
		if ( ! is_int( $post_id ) ) {
			return [];
		}
		return $this->headings_by_post[ $post_id ];
	}

	/**
	 * Compute the heading anchor list for a post given its ID and content string.
	 *
	 * Retrieves precomputed headings if they are available.
	 *
	 * @param int|bool $post_id Post ID.
	 * @param string   $content Post content string.
	 * @return array heading anchor list.
	 */
	protected function calculate_heading_list( $post_id, string $content ) : array {
		if ( $this->has_heading_list( $post_id ) ) {
			return $this->get_heading_list( $post_id );
		}

		$heading_count = preg_match_all(
			// Capture group 1: heading level.
			// Capture group 2: heading tag's HTML attributes.
			// Capture group 3: heading's inner content string.
			'/<h(\d)([^>]*)>(.*?)<\/h\1>/',
			$content,
			$heading_matches,
			PREG_SET_ORDER
		);

		if ( ! $heading_count ) {
			return [];
		}

		// Iterate through the matches to build arrays of heading information.
		$headings = array_map(
			function( $match ) : array {
				if ( strpos( $match[2], 'id=' ) !== false ) {
					// If there is an ID already in the HTML attributes, pull it out
					// and save it for later.
					$id = preg_replace(
						'/.*id=([\'"])(.*?)\1.*/',
						'$2',
						$match[2]
					);
					$has_id = true;
				} else {
					// If no ID already, compute one from the heading's inner content.
					$id = Table_Of_Contents::get_id_value( $match[3] );
					$has_id = false;
				}

				return [
					'original'   => $match[0],
					'level'      => (int) $match[1],
					'content'    => $match[3],
					'id'         => $id,
					'has_id'     => $has_id,
				];
			},
			$heading_matches
		);

		// Store the heading list for later use in filters and [toc] shortcodes or blocks.
		if ( is_int( $post_id ) ) {
			$this->set_heading_list( $post_id, $headings );
		}

		return $headings;
	}

	/**
	 * Filter the content to ensure each <h#> tag has an id attribute.
	 *
	 * Stores the list of headings in this post in $this->headings_by_post;
	 *
	 * @param string $content Content string.
	 * @return string Filtered content.
	 */
	public function filter_ensure_header_ids( string $content ) : string {
		foreach ( $this->calculate_heading_list( get_the_ID(), $content ) as $heading ) {
			// Inject IDs for any tags which did not have them using a simple search-replace.
			if ( $heading['has_id'] ) {
				continue;
			}

			$level = $heading['level'];

			// Replace the original string with a rewritten heading which includes an ID.
			// We assume each heading's original string is unique within a post.
			$content = str_replace(
				$heading['original'],
				preg_replace(
					sprintf( '/^<h%d/', $level ),
					sprintf( '<h%d id="%s"', $level, esc_attr( $heading['id'] ) ),
					$heading['original']
				),
				$content
			);
		}

		return $content;
	}

	/**
	 * Convert a heading's inner content into a kebab-case ID attribute value.
	 *
	 * @param string $content The content of a heading tag.
	 * @return string Cleaned ID value.
	 */
	public static function get_id_value( string $content ) : string {
		$id = preg_replace(
			'/[^a-z0-9]+/',
			'-',
			strtolower(
				// Parse entities as HTML5.
				html_entity_decode(
					wp_kses( $content, [] ),
					ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8'
				)
			)
		);

		// Anchors lose their utility after a practical maximum length.
		return mb_strimwidth( $id, 0, 50, '_' );
	}

	/**
	 * When inserting a shortcode in Markdown mode from the frontend, it gets
	 * saved in the post content within a <p> tag. This interferes with the
	 * parsing and rendering of the code later, so this filter extracts it.
	 *
	 * @param string $content Post content.
	 * @return string Filtered post content.
	 */
	public function handle_markdown_toc_shortcode( string $content ) : string {
		return preg_replace( '/<p>[TOC]<\/p>/', '[Wicked]', $content );
	}
}
