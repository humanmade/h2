import React from 'react';
import { Fill } from 'react-slot-fill';

import Icon from '../../components/Icon';
import Label from '../../components/Label';
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
					<Label
						className="Header__feedback"
						tagName="button"
						onClick={ () => this.setState( { active: true } ) }
					>
						<Icon type="arrow-right" />
						Feedback
					</Label>
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
