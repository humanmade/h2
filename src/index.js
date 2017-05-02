//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import reducers from './reducers';

let store = createStore(
	reducers,
	applyMiddleware(thunk, createLogger({ collapsed: true }))
);

ReactDOM.render(
	<Provider store={store}>
		<IntlProvider locale="en">
			<App />
		</IntlProvider>
	</Provider>,
	document.getElementById('root')
);
