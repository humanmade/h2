import PropTypes from 'prop-types';
import React from 'react';

import CurrentUserDropDown from './CurrentUserDropDown';
import HeaderButton from './HeaderButton';
import Logo from './Logo';
import SearchInput from './SearchInput';
import { User } from '../shapes';

import './Header.css';

export default function Header( props ) {
	return <div className="Header">
		<div className="Inner">
			<Logo />
			<HeaderButton
				onClick={props.onWritePost}
				title="New Post"
				icon="icon icon--plus-alt"
				path="new-post"
			/>
			<SearchInput onSearch={props.onSearch} value={props.searchValue} />
			{props.currentUser
				? <CurrentUserDropDown user={props.currentUser} />
				: null}
			{ props.currentUser ?
				<HeaderButton
					onClick={ props.onLogOut }
					title="Log Out"
					path="log-out"
				/>
			: null }
		</div>
	</div>;
}

Header.defaultProps = {
	searchValue: '',
};

Header.propTypes = {
	currentUser: User,
	searchValue: PropTypes.string,
	onLogOut: PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onWriteStatus: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
};
