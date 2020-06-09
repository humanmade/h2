import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React from 'react';

import AuthorLink from './AuthorLink';
import { users } from '../../types';

class Mention extends React.Component {
	render() {
		const user = this.props.users && this.props.users.length ? this.props.users[0] : null;

		return (
			<AuthorLink user={ user }>
				{ this.props.children }
			</AuthorLink>
		);
	}
}

Mention.propTypes = { user: PropTypes.object };

export default withArchive(
	users,
	state => state.users,
	props => {
		const { username } = props;
		users.registerArchive( `slug/${ username }`, { slug: username } );
		return `slug/${ username }`;
	},
	{
		mapDataToProps: data => ( { users: data.posts } ),
	},
)( Mention );
