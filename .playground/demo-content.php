<?php
/**
 * Seed demo content for the H2 WordPress Playground demo.
 *
 * This file is the source of truth for the demo content. blueprint.json
 * embeds a copy of it (see .playground/README.md for how to regenerate),
 * while blueprint-local.json requires it from the mounted theme directory.
 */

if ( ! defined( 'ABSPATH' ) ) {
	require_once '/wordpress/wp-load.php';
}

if ( get_option( 'h2_demo_seeded' ) ) {
	return;
}
update_option( 'h2_demo_seeded', true );

// Remove the default sample content.
wp_delete_post( 1, true );
wp_delete_post( 2, true );

// Demo team members. All accounts use the password "password".
$members = [
	'kanako' => [ 'Kanako Ito', 'editor' ],
	'riley'  => [ 'Riley Chen', 'author' ],
	'sam'    => [ 'Sam Osei', 'author' ],
];
$users = [ 'admin' => 1 ];
foreach ( $members as $login => $member ) {
	$users[ $login ] = wp_insert_user( [
		'user_login'   => $login,
		'user_pass'    => 'password',
		'user_email'   => $login . '@example.com',
		'display_name' => $member[0],
		'first_name'   => explode( ' ', $member[0] )[0],
		'last_name'    => explode( ' ', $member[0] )[1],
		'role'         => $member[1],
	] );
}

$categories = [];
foreach ( [ 'Announcements', 'Projects', 'Watercooler' ] as $name ) {
	$term = wp_insert_term( $name, 'category' );
	$categories[ $name ] = is_wp_error( $term ) ? 0 : $term['term_id'];
}

// Pages, for the sidebar page list.
wp_insert_post( [
	'post_type'    => 'page',
	'post_title'   => 'Team Handbook',
	'post_status'  => 'publish',
	'post_content' => '<!-- wp:paragraph --><p>Everything you need to know about how the team works: rituals, tools, and expectations.</p><!-- /wp:paragraph -->',
] );
wp_insert_post( [
	'post_type'    => 'page',
	'post_title'   => 'Onboarding',
	'post_status'  => 'publish',
	'post_content' => '<!-- wp:paragraph --><p>New here? Start with the Team Handbook, then introduce yourself in Watercooler.</p><!-- /wp:paragraph -->',
] );

$now = time();

/**
 * Insert a demo post.
 *
 * @param array $args Overrides for wp_insert_post(), plus hours_ago.
 * @return int Post ID.
 */
function h2_demo_insert_post( array $args ) : int {
	$hours_ago = $args['hours_ago'];
	unset( $args['hours_ago'] );

	return (int) wp_insert_post( array_merge( [
		'post_status'   => 'publish',
		'post_date_gmt' => gmdate( 'Y-m-d H:i:s', time() - $hours_ago * HOUR_IN_SECONDS ),
	], $args ) );
}

/**
 * Insert a demo comment from a registered demo user.
 *
 * @param int   $post_id   Post to comment on.
 * @param int   $user_id   Comment author.
 * @param array $args      Overrides for wp_insert_comment(), plus hours_ago.
 * @return int Comment ID.
 */
function h2_demo_insert_comment( int $post_id, int $user_id, array $args ) : int {
	$user      = get_userdata( $user_id );
	$hours_ago = $args['hours_ago'];
	unset( $args['hours_ago'] );

	return (int) wp_insert_comment( array_merge( [
		'comment_post_ID'      => $post_id,
		'user_id'              => $user_id,
		'comment_author'       => $user->display_name,
		'comment_author_email' => $user->user_email,
		'comment_approved'     => 1,
		'comment_date_gmt'     => gmdate( 'Y-m-d H:i:s', time() - $hours_ago * HOUR_IN_SECONDS ),
	], $args ) );
}

// Welcome post, pinned to the top of the stream.
$welcome = h2_demo_insert_post( [
	'post_title'    => 'Welcome to the H2 demo 👋',
	'post_author'   => $users['admin'],
	'post_category' => [ $categories['Announcements'] ],
	'hours_ago'     => 96,
	'post_content'  => implode( "\n\n", [
		'<!-- wp:paragraph --><p>H2 is Human Made&#8217;s internal communications tool: a WordPress theme inspired by the design and principles of P2. This demo site is seeded with a small team so you can see the stream in action.</p><!-- /wp:paragraph -->',
		'<!-- wp:paragraph --><p>Some things to try:</p><!-- /wp:paragraph -->',
		'<!-- wp:list --><ul><li>Write a new post straight from the stream</li><li>Reply to a post — comments update in place</li><li>Browse categories and pages from the sidebar</li></ul><!-- /wp:list -->',
		'<!-- wp:paragraph --><p>You&#8217;re logged in as <strong>admin</strong>. The other demo accounts (kanako, riley, sam) all use the password <code>password</code>.</p><!-- /wp:paragraph -->',
	] ),
] );
stick_post( $welcome );

h2_demo_insert_comment( $welcome, $users['riley'], [
	'hours_ago'       => 90,
	'comment_content' => 'This is a much nicer way to keep up with the team than scrolling back through chat. 🎉',
] );
h2_demo_insert_comment( $welcome, $users['sam'], [
	'hours_ago'       => 88,
	'comment_content' => 'Agreed — async by default, chat for the urgent stuff.',
] );

// Project status update.
$status = h2_demo_insert_post( [
	'post_title'    => 'Design refresh: week 3 update',
	'post_author'   => $users['kanako'],
	'post_category' => [ $categories['Projects'] ],
	'hours_ago'     => 30,
	'post_content'  => implode( "\n\n", [
		'<!-- wp:paragraph --><p>Quick status on the design refresh project:</p><!-- /wp:paragraph -->',
		'<!-- wp:list --><ul><li>New sidebar navigation has landed and is live on staging</li><li>Category and page lists moved to the left sidebar</li><li>Next up: the standalone new-post screen</li></ul><!-- /wp:list -->',
		'<!-- wp:paragraph --><p>Feedback welcome in the comments — especially on the sidebar ordering.</p><!-- /wp:paragraph -->',
	] ),
] );

h2_demo_insert_comment( $status, $users['admin'], [
	'hours_ago'       => 28,
	'comment_content' => 'Sidebar feels much more natural on the left. Ship it.',
] );

// Watercooler question with a small comment thread.
$question = h2_demo_insert_post( [
	'post_title'    => 'What are you all reading at the moment?',
	'post_author'   => $users['riley'],
	'post_category' => [ $categories['Watercooler'] ],
	'hours_ago'     => 20,
	'post_content'  => '<!-- wp:paragraph --><p>Looking for something new for my commute. Fiction or non-fiction, all suggestions welcome!</p><!-- /wp:paragraph -->',
] );

$reply = h2_demo_insert_comment( $question, $users['sam'], [
	'hours_ago'       => 18,
	'comment_content' => '“A City on Mars” — equal parts funny and rigorous.',
] );
h2_demo_insert_comment( $question, $users['riley'], [
	'hours_ago'       => 16,
	'comment_parent'  => $reply,
	'comment_content' => 'Adding it to the list, thanks!',
] );

// Team announcement.
h2_demo_insert_post( [
	'post_title'    => 'Deploy freeze this Thursday',
	'post_author'   => $users['sam'],
	'post_category' => [ $categories['Announcements'] ],
	'hours_ago'     => 8,
	'post_content'  => '<!-- wp:paragraph --><p>Heads up: we&#8217;re freezing deploys from Thursday 09:00 UTC while the platform team rotates database credentials. Normal service resumes Friday morning. Shout in the comments if that blocks anything critical.</p><!-- /wp:paragraph -->',
] );

// A short title-less status update, P2 style.
h2_demo_insert_post( [
	'post_title'    => '',
	'post_author'   => $users['kanako'],
	'post_category' => [ $categories['Watercooler'] ],
	'hours_ago'     => 2,
	'post_content'  => '<!-- wp:paragraph --><p>Coffee machine on the third floor is fixed. Repeat: the coffee machine is fixed. ☕</p><!-- /wp:paragraph -->',
] );
