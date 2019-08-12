import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as SlotFillProvider } from 'react-slot-fill';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';
import { Provider as RestApiProvider } from '../with-api-data';

export default () => {
	const store = createStore(
		reducers,
		applyMiddleware( thunk )
	);

	return story => {
		const dummyFetch = ( url, ...args ) => {
			console.log( url, ...args );
			return Promise.reject( new Error( 'Cannot request API data in Storybook context' ) );
		};

		return (
			<Provider store={ store }>
				<SlotFillProvider>
					<IntlProvider locale="en">
						<RestApiProvider
							fetch={ dummyFetch }
							initialData={ null }
						>
							<Router>
								{ story() }
							</Router>
						</RestApiProvider>
					</IntlProvider>
				</SlotFillProvider>
			</Provider>
		);
	};
};
