import React from 'react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as SlotFillProvider } from 'react-slot-fill';

import { Provider as RestApiProvider } from '../with-api-data';

export default () => {
	return story => {
		const dummyFetch = ( url, ...args ) => {
			console.log( url, ...args );
			return Promise.reject( new Error( 'Cannot request API data in Storybook context' ) );
		};

		return (
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
		);
	};
};
