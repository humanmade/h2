import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import RelativeLink from '../RelativeLink';
import UserHovercard from '../UserHovercard';
import { showSidebarProfile } from '../../actions';

function AuthorName( props ) {
	const { user } = props;

	return <UserHovercard
		user={ user }
	>
		<a className="author-name" onClick={ props.onSelect }>
			{ user.name }
		</a>
	</UserHovercard>;
}

AuthorName.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};

const mapStateToProps = () => ( {} );

const mapDispatchToProps = ( dispatch, props ) => {
	return { onSelect: () => dispatch( showSidebarProfile( props.user.id ) ) };
}

export default connect( mapStateToProps, mapDispatchToProps )( AuthorName );