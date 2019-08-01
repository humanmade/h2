import React from 'react';

import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { withCurrentUser } from '../../hocs';

const FEEDBACK_URL = 'https://formspree.io/mwyqkrgm';
const STATUS = {
	NONE: 'none',
	PENDING: 'pending',
	SUCCESS: 'success',
	ERROR: 'error',
};

class Feedback extends React.Component {
	state = {
		status: STATUS.NONE,
	}

	onSubmit = e => {
		e.preventDefault();

		this.setState( { status: STATUS.PENDING } );

		const opts = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
			body: new FormData( e.target ),
		};

		fetch( FEEDBACK_URL, opts )
			.then( response => {
				this.setState( {
					status: response.ok ? STATUS.SUCCESS : STATUS.ERROR,
				} );
			} )
			.catch( () => {
				this.setState( {
					status: STATUS.ERROR,
				} );
			} );
	}

	render() {
		const { currentUser } = this.props;
		const { status } = this.state;

		return (
			<Modal
				title="Feedback"
				onDismiss={ this.props.onDismiss }
			>
				<p>Found a problem? Missing a feature? Submit quick feedback in seconds right here! Your name and current page will be shared automatically when you submit the form.</p>
				<p>You can also <a href="https://github.com/humanmade/H2/issues/new">file a bug on GitHub</a>.</p>

				<form
					action={ FEEDBACK_URL }
					method="POST"
					onSubmit={ this.onSubmit }
				>
					<input
						name="name"
						type="hidden"
						value={ currentUser.name || currentUser.slug }
					/>

					<input
						name="site"
						type="hidden"
						value={ window.H2Data.site.home }
					/>

					<input
						name="url"
						type="hidden"
						value={ window.location.href }
					/>

					<label htmlFor="Feedback__feedback">
						Your Message
					</label>
					<textarea
						id="Feedback__feedback"
						name="message"
						rows={ 8 }
					/>

					<Button
						disabled={ status === STATUS.PENDING }
						submit
						type="primary"
					>
						Submit Feedback
					</Button>

					{ status === STATUS.SUCCESS && (
						<p>Feedback submitted. Thanks!</p>
					) }
					{ status === STATUS.ERROR && (
						<p>Could not submit your feedback. Try again.</p>
					) }
				</form>
			</Modal>
		);
	}
}

export default withCurrentUser( Feedback );
