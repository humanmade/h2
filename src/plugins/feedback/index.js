import React from 'react';
import { Fill } from 'react-slot-fill';

import HeaderLabel from '../../components/Header/HeaderLabel';
import Feedback from './Feedback';

import './index.css';

export default class Plugin extends React.Component {
	state = {
		active: false,
	};

	render() {
		return (
			<React.Fragment>
				<Fill name="Header.secondary_buttons">
					<HeaderLabel
						className="Header__feedback"
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
