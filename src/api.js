import oauth2Api from 'wordpress-rest-api-oauth-2';
import cookieAuthApi from './wordpress-rest-api-cookie-auth';

const url = window.location.href.split( '?' )[0];
let config = {
	//url: 'http://localhost:8080/',
	url:         'https://updates.hmn.md/',
	callbackURL: url,
};

if ( process.env.NODE_ENV === 'development' ) {
	config.credentials = { client: { id: 'ixgtsngf5p5o' } };
} else if ( config.url === 'https://updates.hmn.md/' ) {
	config.credentials = { client: { id: 'b73rv7has0q2' } };
}

let api = oauth2Api;

if ( window.wpApiSettings ) {
	config = {
		rest_url:    window.wpApiSettings.root,
		credentials: { nonce: window.wpApiSettings.nonce },
	};
	api = cookieAuthApi;
}

export default new api( config );
