import React from 'react';

import Button from './Button';
import AuthorName from './Message/AuthorName';
import { withApiData } from '../with-api-data';

import './Changes.css';

const changes = [
	// Add new changes to the bottom of this list, in the following format:
	{
		date:    '2018-02-26',
		title:   "See What's New",
		content: () => <React.Fragment>
			<p>H2 now includes a changelog (you're looking at it!) to let you know of any new features.</p>
			<p>(We'll only use this for new major features; keep an eye on the <a href="https://github.com/humanmade/H2">H2 repo</a> if you want to see minor changes too!)</p>
		</React.Fragment>,
	},
	{
		date:    '2018-03-06',
		title:   'React to Comments',
		content: () => <p>You can now <span role="img" aria-label="">🎉</span> emoji react to <span role="img" aria-label="">💬</span> comments. <span role="img" aria-label="">🙌</span></p>,
	},
	{
		date:    '2018-03-26',
		title:   'More Useful Hovercards',
		content: withApiData( props => ( { user: '/wp/v2/users/me' } ) )( props => <React.Fragment>
			<p>Hovercards are now more useful, and will be displayed on usernames and avatars.</p>
			{ props.user.isLoading ?
				<p>For example, hover over your name to see yours: <em>loading…</em></p>
			:
				<p>For example, hover over your name to see yours: <AuthorName user={ props.user.data } /></p>
			}
		</React.Fragment> ),
	},
];

function Changes( props ) {
	const { lastView, onDismiss } = props;
	const newChanges = changes.filter( change => {
		const changeDate = new Date( change.date );
		return changeDate > lastView;
	} );
	if ( ! newChanges.length ) {
		return null;
	}

	return <div
		className="Changes"
		onClick={ onDismiss }
	>
		<div
			className="Changes-inner"
			onClick={ e => e.stopPropagation() }
		>
			<header>
				<i className="icon icon--mail" />
				<h2>Latest Changes</h2>
				<Button onClick={ onDismiss }>Close</Button>
			</header>

			{ newChanges.map( change =>
				<div
					key={ change.title }
					className="Changes-change"
				>
					<h3>{ change.title }</h3>
					<change.content />
				</div>
			) }

		</div>
	</div>;
}

class ConnectedChanges extends React.Component {
	render() {
		if ( this.props.forceShow ) {
			return <Changes
				lastView={ new Date( '1970-01-01' ) }
				onDismiss={ this.props.onDismiss }
			/>;
		}

		if ( ! this.props.currentUser || ! this.props.currentUser.data ) {
			return null;
		}

		const rawLastView = this.props.currentUser.data.meta.h2_last_updated || '1970-01-01T00:00:00';
		const lastView = new Date( rawLastView + 'Z' );

		const onDismiss = () => {
			const meta = { h2_last_updated: ( new Date() ).toISOString() };
			this.props.fetch( '/wp/v2/users/me', {
				headers: { 'Content-Type': 'application/json' },
				body:    JSON.stringify( { meta } ),
				method:  'PUT',
			} ).then( r => r.json().then( data => {
				this.props.invalidateData();
			} ) );
		}

		return <Changes
			lastView={ lastView }
			onDismiss={ onDismiss }
		/>;
	}
}

export default withApiData( props => ( { currentUser: '/wp/v2/users/me' } ) )( ConnectedChanges );
