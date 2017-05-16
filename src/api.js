// @flow
import api from 'wordpress-rest-api-oauth-1';

var url = window.location.href.split('?')[0];
var config = {
	//url: 'http://localhost:8080/',
	//url: 'https://updates.hmn.md/',
	url: 'https://demo.wp-api.org/',
	callbackURL: url,
};

if (config.url === 'https://updates.hmn.md/') {
	config.credentials = {
		client: {
			public: '1ndRXh0MJMg6',
			secret: 'krPrIswDMRhmjWih0kpDm4rgZ0w0V69MzpCX4f0JhJehYRrR',
		},
	};
}

if (config.url === 'http://localhost:8080/') {
	config.credentials = {
		client: {
			public: 'NAqxuXe8BDtl',
			secret: 'SQ4ZJOatH79swrAGRmyqFcJ6qBZJhtMV5aMdTgI1OPo8yxN0',
		},
	};
}

if (window.wpApiSettings) {
	config = {
		rest_url: window.wpApiSettings.root,
		nonce: window.wpApiSettings.nonce,
	};
}

export default new api(config);
