<?php
/**
 * Code modifying or enhancing H2 post content.
 */

namespace H2\Content;

/**
 * Instantiate classes and connect namespace functions to actions and hooks.
 */
function bootstrap() : void {
	new Table_Of_Contents();
}
