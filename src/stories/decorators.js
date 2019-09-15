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
}

const checkerboardStyle = {
	backgroundImage: `
		linear-gradient(45deg, #f3f3f3 25%, transparent 25%),
		linear-gradient(-45deg, #f3f3f3 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #f3f3f3 75%),
		linear-gradient(-45deg, transparent 75%, #f3f3f3 75%)
	`,
	backgroundSize: '20px 20px',
	backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
};

export const withPadding = story => {
	const style = {
		padding: '40px',
		...checkerboardStyle,
	};
	const innerStyle = {
		background: '#fff',
	};

	return (
		<div style={ style }>
			<div style={ innerStyle }>
				{ story() }
			</div>
		</div>
	);
}

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

		...checkerboardStyle,
	};
	const innerStyle = {
		background: '#fff',
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
}
