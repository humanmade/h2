import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

export default () => {
	const store = createStore(
		reducers,
		applyMiddleware( thunk )
	);

	return story => <Provider store={ store }>{ story() }</Provider>;
};
