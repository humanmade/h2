import React from 'react';

import Avatar from './Avatar';
import { User } from '../shapes';

import './CurrentUserDropDown.css';

export default function CurrentUserDropDown( props ) {
	return (
		<div className="CurrentUserDropDown">
			<span>{props.user.name}</span>
			<Avatar url={props.user.avatar_urls['96']} size={40} />
		</div>
	);
}

CurrentUserDropDown.propTypes = {
	user: User.isRequired,
};
