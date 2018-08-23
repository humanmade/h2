import PropTypes from 'prop-types';
import React from 'react';

import AuthorLink from './AuthorLink';
import { withApiData } from '../../with-api-data';

class Mention extends React.Component {
	render() {
		const user = this.props.user.data ? this.props.user.data[0] : null;

		return (
			<AuthorLink user={ user }>
				{ this.props.children }
			</AuthorLink>
		);
	}
}

Mention.propTypes = { user: PropTypes.object };

const mapPropsToData = props => ( { user: `/wp/v2/users?slug=${ props.username }` } );

export default withApiData( mapPropsToData )( Mention );
