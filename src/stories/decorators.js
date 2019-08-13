import addons from '@storybook/addons'
import withRedux from 'addon-redux/withRedux'
import withReduxEnhancer from 'addon-redux/enhancer'
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const store = createStore(
	reducers,
	compose(
		withReduxEnhancer,
		applyMiddleware( thunk )
	)
);

export function withStore( state, actions = [] ) {
	const settings = {
		Provider,
		store,
		state,
		actions,
	};

	return withRedux( addons )( settings );
};

export const withPadding = story => {
	const style = {
		margin: '40px',
	};

	return (
		<div style={ style }>
			{ story() }
		</div>
	);
}
