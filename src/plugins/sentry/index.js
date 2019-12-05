import * as Sentry from '@sentry/browser';
import React from 'react';

import { withCurrentUser } from '../../hocs';

class SentryPlugin extends React.Component {
	componentDidMount() {
		this.configure();
	}

	configure() {
		Sentry.configureScope( scope => {
			const { currentUser } = this.props;
			if ( ! currentUser ) {
				return;
			}

			scope.setUser( {
				id: currentUser.id,
				username: currentUser.slug,
			} );
		} );
	}

	render() {
		return null;
	}
}

const ConnectedSentryPlugin = withCurrentUser( SentryPlugin );

export default function register() {
	if ( ! window.H2Data.site.sentry_key ) {
		return;
	}

	Sentry.init( {
		dsn: window.H2Data.site.sentry_key,
		environment: window.H2Data.site.environment || 'unknown',
	} );

	window.H2.plugins.register( ConnectedSentryPlugin );
}
