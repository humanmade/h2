import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from './Button';
import Modal from './Modal';

class SessionExpiredWarning extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			dismissed: false,
		};
	}

	onDismiss = () => {
		this.setState( {
			dismissed: true,
		} );
	};

	onReload = () => {
		document.location.reload();
	};

	render() {
		if ( ! this.props.session || ! this.props.session.isExpired ) {
			return null;
		}

		if ( this.state.dismissed ) {
			return (
				<div>
					<p className="font-bold text-[0.9rem] m-1 leading-[1.2] text-center">Session Disconnected</p>
				</div>
			);
		}

		let message = null;
		switch ( this.props.session.status ) {
			case 401:
				message = (
					<p>You are signed out.</p>
				);
				break;
			case 403:
				message = (
					<p>Your session expired.</p>
				);
				break;
			default:
				message = (
					<p>An unknown error occurred.</p>
				);
		}

		return (
			<Modal
				title={ <span><i className="icon icon--link" /> Connection Error</span> }
				onDismiss={ this.onDismiss }
			>
				<div className="text-center">
					{ message }

					<Button onClick={ this.onReload }>
						Reload to refresh session
					</Button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => ( {
	session: state.session,
} );

export default connect( mapStateToProps )( SessionExpiredWarning );
