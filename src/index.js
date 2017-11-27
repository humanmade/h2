import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { RESTAPIContext } from './with-api-data';

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
				<RESTAPIContext api={ api }>
					<Main />
				</RESTAPIContext>
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
