import PropTypes from 'prop-types';
import React from 'react';

import RelativeLink from '../RelativeLink';
import UserHovercard from '../UserHovercard';

export default function AuthorName( props ) {
	const { user } = props;

	return <UserHovercard
		user={ user }
	>
		<span className="author-name">
			<RelativeLink to={ user.link }>{ user.name }</RelativeLink>
		</span>
	</UserHovercard>;
}

AuthorName.propTypes = {
	user: PropTypes.shape( {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ).isRequired,
};
