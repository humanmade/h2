// @flow
import api from 'wordpress-rest-api-oauth-1'

var config = {
	//url: 'http://localhost:8080/',
	url: 'https://demo.wp-api.org/',
}

if ( window.wpApiSettings ) {
	config = {
		rest_url: window.wpApiSettings.root,
		nonce: window.wpApiSettings.nonce,
	}
}

export default new api( config )
