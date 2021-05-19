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
		<div id="root"></div>
		<?php wp_footer(); ?>
	</body>
</html>
