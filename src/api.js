// @flow
import api from 'wordpress-rest-api-oauth-1'

var config = {
	url: 'https://hmn.md/',
}

if ( window.wpApiSettings ) {
	config = {
		rest_url: window.wpApiSettings.root,
		nonce: window.wpApiSettings.nonce,
	}
}

export default new api( config )
