import addons from '@storybook/addons';
import withRedux from 'addon-redux/withRedux';
import withReduxEnhancer from 'addon-redux/enhancer';
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
}

export const withPadding = ( innerStyle = {} ) => story => {
	const style = {
		padding: '40px',
	};

	return (
		<div style={ style }>
			<div style={ innerStyle }>
				{ story() }
			</div>
		</div>
	);
};

export const withCentering = ( extraStyle = {} ) => story => {
	const style = {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,

		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	};
	const innerStyle = {
		position: 'relative',
		...extraStyle,
	};

	return (
		<div style={ style }>
			<div style={ innerStyle }>
				{ story() }
			</div>
		</div>
	);
};
