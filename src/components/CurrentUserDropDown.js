// @flow
import React from 'react';
import './CurrentUserDropDown.css';
import type { User } from '../types';
import Avatar from './Avatar';

export default function CurrentUserDropDown(
	props: {
		user: User,
	}
) {
	return (
		<div className="CurrentUserDropDown">
			<span>{props.user.name}</span>
			<Avatar url={props.user.avatar_urls['96']} size={40} />
		</div>
	);
}
