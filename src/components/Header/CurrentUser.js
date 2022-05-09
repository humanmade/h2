import React from 'react';
import { connect } from 'react-redux';

import { showMetaSidebar } from '../../actions';
import { User } from '../../shapes';
import Avatar from '../Avatar';

import './CurrentUser.css';

function CurrentUser( props ) {
	const { user } = props;

	if ( ! user ) {
		return null;
	}

	return (
		<button
			className="Header-CurrentUser"
			onClick={ props.onShowSidebar }
		>
			<Avatar
				key="avatar"
				size={ 40 }
				url={ user.avatar_urls['96'] }
			/>
		</button>
	);
}

CurrentUser.propTypes = {
	user: User.isRequired,
};

const mapDispatchToProps = dispatch => {
	return { onShowSidebar: () => dispatch( showMetaSidebar() ) };
};

export default connect( () => ( {} ), mapDispatchToProps )( CurrentUser );
