import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import UserHovercard from '../UserHovercard';
import { showSidebarProfile } from '../../actions';

import './AuthorLink.css';

function AuthorLink( props ) {
	const { children, user } = props;

	if ( ! user ) {
		return children;
	}

	return <UserHovercard
		user={ user }
	>
		<button
			className="AuthorLink"
			onClick={ props.onSelect }
			type="button"
		>
			{ children }
		</button>
	</UserHovercard>;
}

AuthorLink.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

const mapStateToProps = () => ( {} );

const mapDispatchToProps = ( dispatch, props ) => {
	return { onSelect: () => dispatch( showSidebarProfile( props.user.id ) ) };
}

export default connect( mapStateToProps, mapDispatchToProps )( AuthorLink );
