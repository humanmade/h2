import React from 'react';

import Button from './Button';
import { changes, getChangesForUser } from '../changelog';
import { withApiData } from '../with-api-data';

import './Changes.css';

function Changes( props ) {
	const { newChanges, onDismiss } = props;
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
				newChanges={ changes }
				onDismiss={ this.props.onDismiss }
			/>;
		}

		if ( ! this.props.currentUser || ! this.props.currentUser.data ) {
			return null;
		}

		const newChanges = getChangesForUser( this.props.currentUser.data );

		const onDismiss = () => {
			const meta = { h2_last_updated: ( new Date() ).toISOString() };
			this.props.fetch( '/wp/v2/users/me', {
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify( { meta } ),
				method: 'PUT',
			} ).then( r => r.json().then( data => {
				this.props.invalidateData();
			} ) );
		}

		return <Changes
			newChanges={ newChanges }
			onDismiss={ onDismiss }
		/>;
	}
}

export default withApiData( props => ( { currentUser: '/wp/v2/users/me' } ) )( ConnectedChanges );
