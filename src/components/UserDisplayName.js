import PropTypes from 'prop-types';
import React from 'react';

export default function UserDisplayName( props ) {
	if ( props.userId === 0 ) {
		return null;
	}

	return <span className={ 'user-display-name ' + props.className }>
		{ props.userName }
	</span>;
}

UserDisplayName.propTypes = {
	userId:    PropTypes.number.isRequired,
	userName:  PropTypes.string.isRequired,
	className: PropTypes.string,
};
