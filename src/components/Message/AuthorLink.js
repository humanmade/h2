import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LinkButton from '../LinkButton';
import UserHovercard from '../UserHovercard';
import { showSidebarProfile } from '../../actions';

function AuthorLink( props ) {
	const { children, user } = props;

	if ( ! user ) {
		return children;
	}

	return (
		<UserHovercard
			user={ user }
		>
			<LinkButton
				className="AuthorLink"
				onClick={ props.onSelect }
			>
				{ children }
			</LinkButton>
		</UserHovercard>
	);
}

AuthorLink.propTypes = {
	user: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ),
};

const mapStateToProps = () => ( {} );

const mapDispatchToProps = ( dispatch, props ) => {
	return {
		onSelect: () => dispatch( showSidebarProfile( props.user.id ) ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( AuthorLink );
