import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import App from './App';
import reducers from './reducers';

import './hm-pattern-library/assets/styles/juniper.css';

let store = createStore(
	reducers,
	composeWithDevTools( applyMiddleware( thunk, createLogger( { collapsed: true } ) ) )
);

const render = Main => {
	ReactDOM.render(
		<Provider store={store}>
			<IntlProvider locale="en">
				<Main />
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
