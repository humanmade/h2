// @flow
import api from 'wordpress-rest-api-oauth-1'

var config = {
	//url: 'http://localhost:8080/',
	url: 'https://updates.hmn.md/',
	//url: 'https://demo.wp-api.org/',
}

if ( config.url === 'https://updates.hmn.md/' ) {
	config.credentials = {
		client: {
			public: '1ndRXh0MJMg6',
			secret: 'krPrIswDMRhmjWih0kpDm4rgZ0w0V69MzpCX4f0JhJehYRrR',
		}
	}
	config.callbackURL = 'http://localhost:3000/'
}

if ( window.wpApiSettings ) {
	config = {
		rest_url: window.wpApiSettings.root,
		nonce: window.wpApiSettings.nonce,
	}
}

export default new api( config )
