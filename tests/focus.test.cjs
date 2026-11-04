const assert = require( 'node:assert/strict' );
const { after, beforeEach, test } = require( 'node:test' );
const { JSDOM } = require( 'jsdom' );

const dom = new JSDOM( '<!doctype html><body></body>' );
global.window = dom.window;
global.document = dom.window.document;
global.Element = dom.window.Element;
global.getComputedStyle = dom.window.getComputedStyle.bind( dom.window );

// jsdom has no layout engine. Model Chrome's non-empty rectangles for closed
// disclosure descendants, which caused the original drawer regression.
dom.window.HTMLElement.prototype.getClientRects = () => [ { width: 100, height: 40 } ];
dom.window.HTMLElement.prototype.getBoundingClientRect = () => ( { width: 100, height: 40 } );

const { focusSidebarView, trapFocus } = require( '../src/focus' );

beforeEach( () => {
	document.body.innerHTML = `
		<button id="outside">Page control</button>
		<aside id="drawer" tabindex="-1">
			<button id="close">Close menu</button>
			<a href="/" id="home">All posts</a>
			<details id="widget">
				<summary id="summary">Leadership Updates</summary>
				<a href="/post" id="post">Latest post</a>
				<details open>
					<summary>Nested disclosure</summary>
					<a href="/nested" id="nested">Nested post</a>
				</details>
			</details>
		</aside>`;
} );

after( () => dom.window.close() );

function pressTab( id, shiftKey = false ) {
	document.getElementById( id ).focus();
	const event = new dom.window.KeyboardEvent( 'keydown', { key: 'Tab', shiftKey, cancelable: true } );
	trapFocus( event, document.getElementById( 'drawer' ) );
	return event;
}

test( 'Tab wraps from the final closed widget summary to the close button', () => {
	assert.equal( pressTab( 'summary' ).defaultPrevented, true );
	assert.equal( document.activeElement.id, 'close' );
} );

test( 'Shift+Tab wraps to the summary, excluding all closed widget descendants', () => {
	assert.equal( pressTab( 'close', true ).defaultPrevented, true );
	assert.equal( document.activeElement.id, 'summary' );
} );

test( 'open widget links enter the tab order, including nested disclosures', () => {
	document.getElementById( 'widget' ).open = true;
	pressTab( 'close', true );
	assert.equal( document.activeElement.id, 'nested' );
	pressTab( 'nested' );
	assert.equal( document.activeElement.id, 'close' );
} );

test( 'ordinary navigation within the drawer keeps native Tab behaviour', () => {
	assert.equal( pressTab( 'home' ).defaultPrevented, false );
	assert.equal( document.activeElement.id, 'home' );
} );

test( 'hidden, disabled and negative-tabindex controls do not become boundaries', () => {
	document.getElementById( 'drawer' ).insertAdjacentHTML( 'beforeend', `
		<button disabled>Disabled</button>
		<fieldset disabled><button>Disabled by fieldset</button></fieldset>
		<button tabindex="-1">Programmatic focus only</button>
		<button style="visibility:hidden">Hidden</button>
		<div inert><button>Inert</button></div>` );
	pressTab( 'close', true );
	assert.equal( document.activeElement.id, 'summary' );
} );

test( 'a radio group uses the checked radio as its tab stop', () => {
	document.getElementById( 'drawer' ).insertAdjacentHTML( 'beforeend', `
		<input type="radio" name="mode" id="checked" checked>
		<input type="radio" name="mode" id="unchecked">` );
	pressTab( 'close', true );
	assert.equal( document.activeElement.id, 'checked' );
	pressTab( 'checked' );
	assert.equal( document.activeElement.id, 'close' );
} );

test( 'focus outside the drawer is recovered in either direction', () => {
	pressTab( 'outside' );
	assert.equal( document.activeElement.id, 'close' );
	pressTab( 'outside', true );
	assert.equal( document.activeElement.id, 'summary' );
} );

test( 'focus on the drawer itself enters its controls', () => {
	pressTab( 'drawer' );
	assert.equal( document.activeElement.id, 'close' );
} );

test( 'a nested control can handle the key without the drawer overriding it', () => {
	document.getElementById( 'summary' ).focus();
	const event = new dom.window.KeyboardEvent( 'keydown', { key: 'Tab', cancelable: true } );
	event.preventDefault();
	trapFocus( event, document.getElementById( 'drawer' ) );
	assert.equal( document.activeElement.id, 'summary' );
} );

test( 'entering inline navigation focuses its Back button', () => {
	document.getElementById( 'drawer' ).innerHTML = '<aside tabindex="-1"><div class="Sidebar-content"><nav><button class="Sidebar-back">Back</button></nav></div></aside>';
	focusSidebarView( document.getElementById( 'drawer' ), null );
	assert.equal( document.activeElement.className, 'Sidebar-back' );
} );

test( 'returning from inline navigation restores its original trigger', () => {
	document.getElementById( 'drawer' ).innerHTML = '<aside tabindex="-1"><div class="Sidebar-content"><nav><button data-view="categories">Categories</button><button data-view="posts">Post archive</button></nav></div></aside>';
	focusSidebarView( document.getElementById( 'drawer' ), 'posts' );
	assert.equal( document.activeElement.dataset.view, 'posts' );
} );

test( 'entering a full panel focuses its accessible container', () => {
	focusSidebarView( document.body, null );
	assert.equal( document.activeElement.id, 'drawer' );
} );

test( 'returning from a full panel focuses site navigation without a stale trigger', () => {
	document.getElementById( 'drawer' ).innerHTML = '<aside tabindex="-1"><div class="Sidebar-content"><nav><button data-view="categories">Categories</button></nav></div></aside>';
	focusSidebarView( document.getElementById( 'drawer' ), 'profile' );
	assert.equal( document.activeElement, document.querySelector( '#drawer aside' ) );
} );
