import * as Sentry from '@sentry/browser';
// import App from 'src/App';

export default function register() {
	if ( ! window.H2Data.site.sentry_key ) {
		return;
	}

	Sentry.init( {
		dsn: window.H2Data.site.sentry_key,
	} );
}
