import React from 'react';
import { connect } from 'react-redux';

import Avatar from '../Avatar';
import { showMetaSidebar } from '../../actions';
import { withCurrentUser } from '../../hocs';
import { User } from '../../shapes';

import './CurrentUser.css';

function CurrentUser( props ) {
	const { currentUser } = props;

	if ( ! currentUser ) {
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
				url={ currentUser.avatar_urls['96'] }
			/>
		</button>
	);
}

CurrentUser.propTypes = {
	currentUser: User.isRequired,
};

const mapDispatchToProps = dispatch => {
	return { onShowSidebar: () => dispatch( showMetaSidebar() ) };
};

export default connect( () => ( {} ), mapDispatchToProps )( withCurrentUser( CurrentUser ) );
