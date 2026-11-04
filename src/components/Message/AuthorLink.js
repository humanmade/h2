import PropTypes from 'prop-types';
import React from 'react';

import { withUser } from '../../hocs';
import Link from '../Link';
import UserHovercard from '../UserHovercard';

export default function AuthorLink( props ) {
	const { children, user, withHovercard } = props;

	if ( ! user ) {
		return children;
	}

	const link = <Link href={ user.link }>{ children }</Link>;

	if ( ! withHovercard ) {
		return link;
	}

	return <UserHovercard user={ user }>{ link }</UserHovercard>;
}

AuthorLink.propTypes = {
	user: PropTypes.shape( {
		id: PropTypes.number.isRequired,
		link: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	} ),
	withHovercard: PropTypes.bool.isRequired,
};

AuthorLink.defaultProps = { withHovercard: true };

/**
 * Link to a user when only their ID is known.
 *
 * Shows the children without a link until the user has loaded, or if they can't
 * be loaded.
 */
export const AuthorLinkById = withUser( props => props.id )( ( { children, user } ) => (
	<AuthorLink user={ user } withHovercard={ false }>
		{ children }
	</AuthorLink>
) );
