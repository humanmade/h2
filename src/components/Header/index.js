import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import { withCurrentUser } from '../../hocs';
import SearchInput from '../SearchInput';

import CurrentUser from './CurrentUser';
import HeaderButton from './HeaderButton';
import Logo from './Logo';

import './index.css';

export class Header extends Component {
	render() {

		return (
			<div className="Header">
				<div className="Header-inner">
					<button
						className="Header-site-name"
						type="button"
						onClick={ this.props.onShowSuper }
					>
						<Logo />

						{ window.H2Data.site.name }
					</button>

					<HeaderButton
						onClick={ this.props.onWritePost }
						title="New Post"
						icon="icon icon--plus-alt"
						path="new-post"
					/>

					<Slot name="Header.buttons" />

					<SearchInput
						value={ this.props.searchValue }
						onSearch={ this.props.onSearch }
					/>

					<Slot name="Header.secondary_buttons" />

					{ this.props.currentUser ? (
						<CurrentUser
							user={ this.props.currentUser }
							onLogOut={ this.props.onLogOut }
						/>
					) : null }

					<Slot name="Header.meta" />
				</div>
			</div>
		);
	}
}

Header.defaultProps = {
	searchValue: '',
};

Header.propTypes = {
	searchValue: PropTypes.string,
	onLogOut: PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onSearch: PropTypes.func.isRequired,
};

export default withCurrentUser( Header );
