import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import LinkButton from '../LinkButton';
import UserHovercard from '../UserHovercard';
import { showSidebarProfile } from '../../actions';

function AuthorLink( props ) {
	const { children, user, withHovercard } = props;

	if ( ! user ) {
		return children;
	}

	const button = (
		<LinkButton
			className="AuthorLink"
			onClick={ props.onSelect }
		>
			{ children }
		</LinkButton>
	);

	if ( ! withHovercard ) {
		return button;
	}

	return <UserHovercard user={ user }>{ button }</UserHovercard>;
}

AuthorLink.propTypes = {
	user: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ),
	withHovercard: PropTypes.bool.isRequired,
};

AuthorLink.defaultProps = { withHovercard: true };

const mapStateToProps = () => ( {} );

const mapDispatchToProps = ( dispatch, props ) => {
	return {
		onSelect: () => dispatch( showSidebarProfile( props.user.id ) ),
	};
}

export default connect( mapStateToProps, mapDispatchToProps )( AuthorLink );
