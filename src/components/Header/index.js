import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Slot } from 'react-slot-fill';

import CurrentUser from './CurrentUser';
import HeaderButton from './HeaderButton';
import HeaderLabel from './HeaderLabel';
import Logo from './Logo';
import SearchInput from '../SearchInput';
import { withApiData } from '../../with-api-data';

import './index.css';

class Header extends Component {
	render() {
		return <div className="Header">
			<div className="Header-inner">
				<Link to="/" className="Header-site-name">
					<Logo />
					{ window.H2Data.site.name }
				</Link>
				<HeaderButton
					onClick={this.props.onWritePost}
					title="New Post"
					icon="icon icon--plus-alt"
					path="new-post"
				/>

				<Slot name="Header.buttons" />

				<SearchInput onSearch={this.props.onSearch} value={this.props.searchValue} />

				<HeaderLabel
					icon="mail"
					title="What's New?"
					onClick={ this.props.onShowChanges }
				/>

				{ this.props.currentUser.data ? (
					<CurrentUser
						user={ this.props.currentUser.data }
						onLogOut={ this.props.onLogOut }
					/>
				) : null }

				<Slot name="Header.meta" />
			</div>
		</div>;
	}
}

Header.defaultProps = { searchValue: '' };

Header.propTypes = {
	searchValue: PropTypes.string,
	onLogOut:    PropTypes.func.isRequired,
	onWritePost: PropTypes.func.isRequired,
	onSearch:    PropTypes.func.isRequired,
};

export default withApiData( props => ( { currentUser: '/wp/v2/users/me' } ) )( Header );
