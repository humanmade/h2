import React from 'react';

import Modal from './Modal';
import { changes, getChangesForUser } from '../changelog';
import { withCurrentUser } from '../hocs';

import './Changes.css';

function Changes( props ) {
	const { newChanges, onDismiss } = props;

	// Separate old changes.
	const oldChanges = changes.filter( change => newChanges.indexOf( change ) === -1 );

	// Show previous changes in reverse-chronological order.
	oldChanges.reverse();

	return (
		<Modal
			title={ <span><i className="icon icon--mail" /> Latest Changes</span> }
			onDismiss={ onDismiss }
		>

			{ newChanges.map( change => (
				<div
					key={ change.title }
					className="Changes-change"
				>
					<h3>{ change.title }</h3>
					<change.content />
				</div>
			) ) }

			{ newChanges.length > 0 && oldChanges.length > 0 ? (
				<h2 className="Changes-previous">Previous Changes</h2>
			) : null }

			{ oldChanges.map( change => (
				<div
					key={ change.title }
					className="Changes-change"
				>
					<h3>{ change.title }</h3>
					<change.content />
				</div>
			) ) }
		</Modal>
	);
}

class ConnectedChanges extends React.Component {
	render() {
		if ( ! this.props.currentUser ) {
			return null;
		}

		const newChanges = getChangesForUser( this.props.currentUser );

		const onDismiss = () => {
			const meta = { h2_last_updated: ( new Date() ).toISOString() };
			this.props.onUpdateCurrentUser( { meta } );
			this.props.onDismiss();
		}

		return (
			<Changes
				newChanges={ newChanges }
				onDismiss={ onDismiss }
			/>
		);
	}
}

export default withCurrentUser( ConnectedChanges );
