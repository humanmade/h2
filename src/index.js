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

const render = Main => {
	ReactDOM.render(
		<Provider store={store}>
			<IntlProvider locale="en">
				<Main />
			</IntlProvider>
		</Provider>,
		document.getElementById('root')
	);
};

render( App );

if (module.hot) {
	module.hot.accept('./App', () => {
		const NextApp = require('./App').default;
		render( NextApp );
	});
}
