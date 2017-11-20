import React from 'react';

import Avatar from './Avatar';
import Dropdown from './Dropdown';
import { User } from '../shapes';

import './CurrentUserDropDown.css';

export default class CurrentUserDropDown extends React.Component {
	render() {
		const { user } = this.props;
		const label = [
			<span key="name">{ user.name }</span>,
			<Avatar
				key="avatar"
				size={ 40 }
				url={ user.avatar_urls['96'] }
			/>,
		];

		return <Dropdown
			className="CurrentUserDropDown"
			label={ label }
		>
			<ul className="CurrentUserDropDown-items">
				<li>
					<button
						onClick={ this.props.onLogOut }
					>Log out</button>
				</li>
			</ul>
		</Dropdown>;
	}
}

CurrentUserDropDown.propTypes = { user: User.isRequired };
