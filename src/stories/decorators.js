import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

export function withStore( state ) {
	return story => {
		// Reset the fixture when Storybook renders a story instead of sharing edits.
		const store = createStore( reducers, state, applyMiddleware( thunk ) );
		return <Provider store={ store }>{ story() }</Provider>;
	};
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
