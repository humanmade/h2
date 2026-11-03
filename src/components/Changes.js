import React from 'react';

import { changes, getChangesForUser } from '../changelog';
import { withCurrentUser } from '../hocs';

import Modal from './Modal';

const formatDate = date => new Date( date + 'T12:00:00Z' ).toLocaleDateString( 'en-US', {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
} );

const Change = ( { change, isNew } ) => (
	<article className="Changes-change py-4 first:pt-0 last:pb-0">
		<div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
			<time dateTime={ change.date }>{ formatDate( change.date ) }</time>
			{ isNew && (
				<span className="rounded-full bg-hm-vibrant-blue/10 px-1.5 leading-5 font-medium text-hm-vibrant-blue">New</span>
			) }
		</div>
		<h3 className="m-0 mb-1.5 text-base leading-6 font-semibold normal-case">{ change.title }</h3>
		<div className="text-gray-700 [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:my-2 [&_ul]:pl-5 [&_a]:text-hm-vibrant-blue">
			<change.content />
		</div>
	</article>
);

export function Changes( props ) {
	if ( ! props.currentUser ) {
		return null;
	}

	const newChanges = getChangesForUser( props.currentUser );

	const onDismiss = () => {
		const meta = { h2_last_updated: ( new Date() ).toISOString() };
		props.onUpdateCurrentUser( { meta } );
		props.onDismiss();
	};

	// Show everything newest first, with unseen changes ahead of the rest.
	const recent = [ ...newChanges ].reverse();
	const previous = changes.filter( change => newChanges.indexOf( change ) === -1 ).reverse();

	return (
		<Modal
			title="What's new in H2"
			onDismiss={ onDismiss }
		>
			{ recent.length > 0 && (
				<div className="divide-y divide-hm-beige">
					{ recent.map( change => (
						<Change key={ change.title } change={ change } isNew />
					) ) }
				</div>
			) }

			{ recent.length > 0 && previous.length > 0 && (
				<h3 className="Changes-previous mt-6 mb-3 pt-4 border-t border-hm-beige text-xs font-semibold uppercase tracking-wide text-gray-500">
					Earlier updates
				</h3>
			) }

			<div className="divide-y divide-hm-beige">
				{ previous.map( change => (
					<Change key={ change.title } change={ change } />
				) ) }
			</div>
		</Modal>
	);
}

export default withCurrentUser( Changes );
