import React from 'react';

import Button from './Button';

import './Changes.css';

const changes = [
	// Add new changes above this line, in the following format:
	{
		date:    '2018-02-26',
		title:   "See What's New",
		content: () => <React.Fragment>
			<p>H2 now includes a changelog (you're looking at it!) to let you know of any new features.</p>
			<p>(We'll only use this for new major features; keep an eye on the <a href="https://github.com/humanmade/H2">H2 repo</a> if you want to see minor changes too!)</p>
		</React.Fragment>,
	}
];

export default function Changes( props ) {
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
				<div className="Changes-change">
					<h3>{ change.title }</h3>
					<change.content />
				</div>
			) }

		</div>
	</div>;
}
