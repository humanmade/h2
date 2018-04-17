import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Slot } from 'react-slot-fill';

import CurrentUserDropDown from './CurrentUserDropDown';
import HeaderButton from './HeaderButton';
import SiteSelect from './SiteSelect';
import SearchInput from '../SearchInput';
import { withApiData } from '../../with-api-data';

import './index.css';

class Header extends Component {
	render() {
		return <div className="Header">
			<div className="Header-inner">
				<SiteSelect />

				<HeaderButton
					onClick={this.props.onWritePost}
					title="New Post"
					icon="icon icon--plus-alt"
					path="new-post"
				/>

				<HeaderButton
					icon="mail"
					title="What's New"
					onClick={ this.props.onShowChanges }
				/>

				<Slot name="Header.buttons" />

				<SearchInput onSearch={this.props.onSearch} value={this.props.searchValue} />

				{ this.props.currentUser.data ? (
					<CurrentUserDropDown
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
