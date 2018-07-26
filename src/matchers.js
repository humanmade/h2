import { Matcher } from 'interweave';
import React from 'react';

import Mention from './components/Message/Mention';

export class MentionMatcher extends Matcher {
	replaceWith( match, props ) {
		return (
			<Mention
				key={ props.key }
				username={ props.username }
			>
				{ match }
			</Mention>
		);
	}

	asTag(): string {
		return 'span';
	}

	match( string ) {
		return this.doMatch( string, /@(\w+)/, matches => ( { username: matches[1] } ) );
	}
}

export default [
	new MentionMatcher( 'mention' ),
];
