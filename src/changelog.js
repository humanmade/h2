import React from 'react';

import AuthorLink from './components/Message/AuthorLink';
import Content from './components/Message/Content';
import { withCurrentUser } from './hocs';

export const changes = [
	// Add new changes to the bottom of this list, in the following format:
	{
		date: '2018-02-26',
		title: 'See What\'s New',
		content: () => (
			<React.Fragment>
				<p>H2 now includes a changelog (you're looking at it!) to let you know of any new features.</p>
				<p>(We'll only use this for new major features; keep an eye on the <a href="https://github.com/humanmade/H2">H2 repo</a> if you want to see minor changes too!)</p>
			</React.Fragment>
		),
	},
	{
		date: '2018-03-06',
		title: 'React to Comments',
		content: () => <p>You can now <span role="img" aria-label="">🎉</span> emoji react to <span role="img" aria-label="">💬</span> comments. <span role="img" aria-label="">🙌</span></p>,
	},
	{
		date: '2018-03-26',
		title: 'More Useful Hovercards',
		content: withCurrentUser( props => (
			<React.Fragment>
				<p>Hovercards are now more useful, and will be displayed on usernames and avatars.</p>
				{ props.loadingCurrentUser ? (
					<p>For example, hover over your name to see yours: <em>loading…</em></p>
				) : (
					<p>For example, hover over your name to see yours: <AuthorLink user={ props.currentUser }>{ props.currentUser.name }</AuthorLink></p>
				) }
				<p>You can also click linked names to show a full profile.</p>
			</React.Fragment>
		) ),
	},
	{
		date: '2018-04-16',
		title: 'Custom Emoji',
		content: () => (
			<p>
				You can now use Slack custom emoji in posts or reactions.

				{ ' ' }

				{ ( window.H2Data.site.emoji && window.H2Data.site.emoji['mindblown'] ) ? (
					<img
						alt=":mindblown:"
						src={ window.H2Data.site.emoji['mindblown'].imageUrl }
					/>
				) : null }
			</p>
		),
	},
	{
		date: '2018-05-24',
		title: 'Cross-Site & Category Navigation',
		content: () => (
			<p>H2 now includes navigation between categories and
				across sites, to enable you to work quicker and more efficiently.
				Simply click the red H button in the top left to show the navigation.</p>
		),
	},
	{
		date: '2018-09-14',
		title: 'View Comments for a User',
		content: () => (
			<React.Fragment>
				<p>You can now view a user's comment history. Simply click their profile, then click through to view their comments.</p>
				<p>You can also view your own comments via your sidebar. Click your avatar in the top right.</p>
			</React.Fragment>
		),
	},
	{
		date: '2018-12-07',
		title: 'Draft Before You Post',
		content: () => (
			<React.Fragment>
				<p>You can now save posts for later editing rather than
					publishing immediately, and resume them whenever you're
					ready. Hit the New Post button to get started.</p>
				<p>When you're ready, you can also share a preview link for
					your draft with other editors.</p>
			</React.Fragment>
		),
	},
	{
		date: '2020-01-27',
		title: 'Preview Posts Before You Click',
		content: () => (
			<p>Internal links to other posts will now display a quick preview,
				allowing you to quickly see what's being linked to.</p>
		),
	},
	{
		date: '2020-01-27',
		title: 'Get Tasks Done',
		content: () => (
			<React.Fragment>
				<p>H2 now supports (read-only) task lists.
					Use <code>[ ]</code> or <code>[x]</code> at the start of
					your list items to display the task status inline, just
					like this:</p>
				<pre>{ '* [ ] Do a task!\n* [x] Did a task!' }</pre>
				<Content html="<ul class='Tasklist'><li class='Tasklist-Item'>Do a task!</li><li class='Tasklist-Item' data-checked>Did a task!</li></ul>" />
				<p>The ability to toggle tasks inline and reorder them is coming soon; in the meantime, you'll need to edit your post/comment manually.</p>
			</React.Fragment>
		),
	},
	{
		date: '2022-05-10',
		title: 'Mobile-Friendly',
		content: () => (
			<React.Fragment>
				<p>H2 now sports tighter, more mobile-friendly styling
					at small viewport sizes. Header elements have been
					cleaned up or moved into menus, nav bars narrowed,
					and comment indentation overhauled, to make it easier
					to read and comment on posts from smaller devices.</p>
				<p>Clicking on pagination links or opening a post from
					a post list view now anchors the view to the top of
					the page, just like a normal website.</p>
			</React.Fragment>
		),
	},
];

export function getChanges( lastView ) {
	return changes.filter( change => {
		const changeDate = new Date( change.date );
		return changeDate > lastView;
	} );
}

export function getChangesForUser( user ) {
	if ( ! user ) {
		return null;
	}

	const rawLastView = user.meta.h2_last_updated || '1970-01-01T00:00:00Z';
	const lastView = new Date( rawLastView );

	return getChanges( lastView );
}
