// Load asset paths from a variable instead in prod mode.
// This has to be the first import to ensure correct loading order.
import './webpack-assets-path';

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Fill, Provider as SlotFillProvider } from 'react-slot-fill';

import api from './api';
import App from './App';
import PluginAPI from './plugins';
import loadPlugins from './plugins/load';
import { createStore } from './store';
import { Provider as RestApiProvider } from './with-api-data';

import './pattern-library/assets/sass/juniper.scss';
import './_print.scss';

let store = createStore( window.H2Data.preload );

// Expose the plugin API globally.
window.H2 = window.H2 || {};
window.H2.Fill = Fill;
window.H2.React = React;
window.H2.plugins = new PluginAPI( store );

// Determine the base URL of the site so that subdirectory installs work.
const routerBasename = window.H2Data.site.home.replace(
	new RegExp( `https?://${ window.location.host }` ),
	''
);

// Load our default plugins.
loadPlugins();

const root = document.getElementById( 'root' );
const render = Main => {
	ReactDOM.render(
		<Provider store={ store }>
			<SlotFillProvider>
				<IntlProvider locale="en">
					<RestApiProvider
						fetch={ ( url, ...args ) => api.fetch( url, ...args ) }
						initialData={ window.H2Data.preload }
					>
						<Router basename={ routerBasename }>
							<Main />
						</Router>
					</RestApiProvider>
				</IntlProvider>
			</SlotFillProvider>
		</Provider>,
		root
	);
};

render( App );

if ( module.hot ) {
	module.hot.accept( './App', () => {
		const NextApp = require( './App' ).default;

		render( NextApp );
	} );
}
