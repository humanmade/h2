import React from 'react';
import { connect } from 'react-redux';

import { showMetaSidebar } from '../../actions';
import { User } from '../../shapes';
import Avatar from '../Avatar';

function CurrentUser( props ) {
	const { user } = props;

	if ( ! user ) {
		return null;
	}

	return (
		<button
			className="p-0 bg-transparent border-transparent mb-0 cursor-pointer"
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
