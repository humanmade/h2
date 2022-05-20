<?php
/**
 * The only template file. Because H2 runs as a single-page app with no server
 * rendering, everything happens in JS within #root.
 */

?>
<!doctype html>
<html lang="en">
	<head>
		<meta name="viewport" content="width=device-width">
		<?php wp_head(); ?>
	</head>
	<body <?php body_class(); ?>>
		<?php if ( ! is_user_logged_in() ) : ?>
		<div class="logged-out-warning">
			<p>You are logged out! H2 is designed to be used only while logged in. Some functionality will not work.</p>
		</div>
		<?php endif; ?>
		<div id="root"></div>
		<?php wp_footer(); ?>
	</body>
</html>
