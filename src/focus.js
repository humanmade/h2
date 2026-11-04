import { tabbable } from 'tabbable';

/**
 * Move focus after the sidebar has rendered a different view.
 *
 * @param {HTMLElement} container Sidebar wrapper.
 * @param {?string} previousView View whose navigation trigger should regain focus.
 */
export function focusSidebarView( container, previousView ) {
	const navigation = container.querySelector( '.Sidebar-content nav' );
	const target = navigation && (
		navigation.querySelector( '.Sidebar-back' ) ||
		navigation.querySelector( `[data-view="${ previousView }"]` )
	);
	( target || container.querySelector( 'aside' ) ).focus( { preventScroll: true } );
}

/**
 * Keep keyboard navigation within an open drawer.
 *
 * @param {KeyboardEvent} event Keyboard event from the open drawer.
 * @param {HTMLElement} container Drawer containing the available controls.
 */
export function trapFocus( event, container ) {
	if ( event.key !== 'Tab' || event.defaultPrevented ) {
		return;
	}

	// Layout rectangles alone include descendants of closed <details> in Chrome.
	// Use the browser's tab order, including disclosure and radio-group rules.
	const controls = tabbable( container );
	const first = controls[0];
	const last = controls[controls.length - 1];
	const active = container.ownerDocument.activeElement;
	const atBoundary = event.shiftKey ? active === first : active === last;

	if ( atBoundary || ! controls.includes( active ) ) {
		event.preventDefault();
		const target = event.shiftKey ? last : first;
		if ( target ) {
			target.focus();
		}
	}
}
