// Load asset paths from a variable instead.
// This has to be the first import to ensure correct loading order.
import './path';

import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { Fill, Provider as SlotFillProvider } from 'react-slot-fill';

import { Provider as RestApiProvider } from './with-api-data';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

import api from './api';
import PluginAPI from './plugins';
import loadPlugins from './plugins/load';
import { createStore } from './store';

import './hm-pattern-library/assets/styles/juniper.css';

let store = createStore( window.H2Data.preload );

// Expose the plugin API globally.
window.H2 = window.H2 || {};
window.H2.Fill = Fill;
window.H2.React = React;
window.H2.plugins = new PluginAPI( store );

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
						<Router>
							<Main />
						</Router>
					</RestApiProvider>
				</IntlProvider>
			</SlotFillProvider>
		</Provider>,
		root
	);
};

if ( root ) {
	render( App );

	if ( module.hot ) {
		module.hot.accept( './App', () => {
			const NextApp = require( './App' ).default;
			render( NextApp );
		} );
	}
}
