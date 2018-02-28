import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider as RestApiProvider } from './with-api-data';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import reducers from './reducers';
import api from './api';

import './hm-pattern-library/assets/styles/juniper.css';

let store = createStore(
	reducers,
	composeWithDevTools( applyMiddleware( thunk, createLogger( { collapsed: true } ) ) )
);

const render = Main => {
	ReactDOM.render(
		<Provider store={store}>
			<IntlProvider locale="en">
				<RestApiProvider
					fetch={( url, ...args ) => api.fetch( url, ...args )}
					initialData={ window.H2Data.preload }
				>
					<Router>
						<Main />
					</Router>
				</RestApiProvider>
			</IntlProvider>
		</Provider>,
		document.getElementById( 'root' )
	);
};

render( App );

if ( module.hot ) {
	module.hot.accept( './App', () => {
		const NextApp = require( './App' ).default;
		render( NextApp );
	} );
}
