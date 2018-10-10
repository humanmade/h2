import React from 'react';

import AuthorLink from './components/Message/AuthorLink';
import { withApiData } from './with-api-data';

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
		content: withApiData( props => ( { user: '/wp/v2/users/me' } ) )( props => (
			<React.Fragment>
				<p>Hovercards are now more useful, and will be displayed on usernames and avatars.</p>
				{ props.user.isLoading ? (
					<p>For example, hover over your name to see yours: <em>loading…</em></p>
				) : (
					<p>For example, hover over your name to see yours: <AuthorLink user={ props.user.data }>{ props.user.data.name }</AuthorLink></p>
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

				{ window.H2Data.site.emoji['mindblown'] ? (
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
