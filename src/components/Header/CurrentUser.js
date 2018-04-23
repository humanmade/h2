import React from 'react';

import Dropdown from './Dropdown';
import Avatar from '../Avatar';
import Button from '../Button';
import { User } from '../../shapes';

import './CurrentUser.css';

export default function CurrentUser( props ) {
	const { user } = props;
	const label = <Avatar
		key="avatar"
		size={ 40 }
		url={ user.avatar_urls['96'] }
	/>;

	return <Dropdown
		className="Header-CurrentUser"
		label={ label }
	>
		<Avatar
			key="avatar"
			size={ 96 }
			url={ user.avatar_urls['96'] }
		/>
		<div>
			<p className="Header-CurrentUser-name">{ user.name }</p>
			<p className="Header-CurrentUser-username"><code>@{ user.slug }</code></p>
			<ul className="Header-CurrentUser-items">
				<li>
					<Button
						onClick={ props.onLogOut }
					>Log out</Button>
				</li>
			</ul>
		</div>
	</Dropdown>;
}

CurrentUser.propTypes = { user: User.isRequired };
