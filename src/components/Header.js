// @flow
import React from 'react';
import './Header.css';
import HeaderButton from './HeaderButton';
import Logo from './Logo';
import type { User } from '../types';
import CurrentUserDropDown from './CurrentUserDropDown';
import SearchInput from './SearchInput';

export default function Header(
	props: {
		currentUser?: User,
		onWritePost: () => void,
		onWriteStatus: () => void,
		onSearch: Function,
		searchValue: string,
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
				<SearchInput onSearch={props.onSearch} value={props.searchValue} />
				{props.currentUser
					? <CurrentUserDropDown user={props.currentUser} />
					: null}
			</div>
		</div>
	);
}
