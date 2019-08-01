import React from 'react';
import { Fill } from 'react-slot-fill';

import HeaderLabel from '../../components/Header/HeaderLabel';
import Feedback from './Feedback';

export default class Plugin extends React.Component {
	state = {
		active: false,
	};

	render() {
		return (
			<React.Fragment>
				<Fill name="Header.secondary_buttons">
					<HeaderLabel
						icon="arrow-right"
						title="Feedback"
						onClick={ () => this.setState( { active: true } ) }
					/>
				</Fill>

				{ this.state.active && (
					<Feedback
						onDismiss={ () => this.setState( { active: false } ) }
					/>
				) }
			</React.Fragment>
		);
	}
}
