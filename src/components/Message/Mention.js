import { Matcher } from 'interweave';
import PropTypes from 'prop-types';
import React from 'react';

import AuthorLink from './AuthorLink';
import { withApiData } from '../../with-api-data';

class Mention extends React.Component {
	render() {
		const user = this.props.user.data ? this.props.user.data[0] : null;

		return <AuthorLink user={ user }>
			{ this.props.children }
		</AuthorLink>;
	}
}

Mention.propTypes = { user: PropTypes.object };

const ConnectedMention = withApiData( props => ( { user: `/wp/v2/users?slug=${ props.username }` } ) )( Mention );

export default ConnectedMention;

export class MentionMatcher extends Matcher {
	replaceWith( match, props ) {
		return <ConnectedMention
			key={ props.key }
			username={ props.username }
		>
			{ match }
		</ConnectedMention>;
	}

	asTag(): string {
		return 'span';
	}

	match( string ) {
		return this.doMatch( string, /@(\w+)/, matches => ( { username: matches[1] } ) );
	}
}
