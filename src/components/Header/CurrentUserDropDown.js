import React from 'react';

import Avatar from '../Avatar';
import Button from '../Button';
import Dropdown from '../Dropdown';
import { User } from '../../shapes';

import './CurrentUserDropDown.css';

export default function CurrentUserDropDown( props ) {
	const { user } = props;
	const label = <Avatar
		key="avatar"
		size={ 40 }
		url={ user.avatar_urls['96'] }
	/>;

	return <Dropdown
		className="CurrentUserDropDown"
		label={ label }
	>
		<Avatar
			key="avatar"
			size={ 96 }
			url={ user.avatar_urls['96'] }
		/>
		<div>
			<p className="CurrentUserDropDown-name">{ user.name }</p>
			<p className="CurrentUserDropDown-username"><code>@{ user.slug }</code></p>
			<ul className="CurrentUserDropDown-items">
				<li>
					<Button
						onClick={ props.onLogOut }
					>Log out</Button>
				</li>
			</ul>
		</div>
	</Dropdown>;
	return <div className="CurrentUserDropDown">
		<span>{props.user.name}</span>
		<Avatar user={props.user} url={props.user.avatar_urls['96']} size={40} />
	</div>;
}

CurrentUserDropDown.propTypes = { user: User.isRequired };
