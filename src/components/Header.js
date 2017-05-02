// @flow
import React from 'react';
import './Header.css';
import HeaderButton from './HeaderButton';
import Logo from './Logo';
import type { User } from '../types';
import CurrentUserDropDown from './CurrentUserDropDown';

export default function Header(
	props: {
		currentUser?: User,
		onWritePost: () => void,
		onWriteStatus: () => void,
	}
) {
	return (
		<div className="Header">
			<div className="Inner">
				<Logo />
				<HeaderButton
					onClick={props.onWritePost}
					title="+ New Post"
					path="new-post"
				/>
				<HeaderButton
					onClick={props.onWriteStatus}
					title="+ New Status"
					path="new-status"
				/>
				{props.currentUser
					? <CurrentUserDropDown user={props.currentUser} />
					: null}
			</div>
		</div>
	);
}
