import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import CurrentUserDropDown from './CurrentUserDropDown';
import HeaderButton from './HeaderButton';
import Logo from './Logo';
import SearchInput from './SearchInput';
import { withApiData } from '../with-api-data';

import './Header.css';

class Header extends Component {
	render() {
		return <div className="Header">
			<div className="Header-inner">
				<Link to="/"><Logo /></Link>
				<HeaderButton
					onClick={this.props.onWritePost}
					title="New Post"
					icon="icon icon--plus-alt"
					path="new-post"
				/>
				<SearchInput onSearch={this.props.onSearch} value={this.props.searchValue} />

				{ this.props.currentUser.data ?
					<CurrentUserDropDown
						user={ this.props.currentUser.data }
						onLogOut={ this.props.onLogOut }
					/>
				: null }
			</div>
		</div>;
	}
}

Header.defaultProps = { searchValue: '' };

Header.propTypes = {
	searchValue:   PropTypes.string,
	onLogOut:      PropTypes.func.isRequired,
	onWritePost:   PropTypes.func.isRequired,
	onSearch:      PropTypes.func.isRequired,
};

export default withApiData( props => ( { currentUser: '/wp/v2/users/me' } ) )( Header );
