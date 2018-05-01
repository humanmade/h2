import React from 'react';
import { connect } from 'react-redux';

import { REGISTER_PLUGIN } from '../actions';

export default class PluginAPI {
	constructor( store ) {
		this.store = store;
	}

	register( component, options = {} ) {
		this.store.dispatch( {
			type: REGISTER_PLUGIN,
			component,
			options,
		} );
	}
}

const mapStateToProps = ( { plugins } ) => ( { plugins } );

export const RenderPlugins = connect( mapStateToProps )( props => {
	return props.plugins.map( ( Plugin, idx ) => <Plugin key={ idx } /> );
} );

export const reducer = ( state = [], action ) => {
	switch ( action.type ) {
		case REGISTER_PLUGIN:
			return [
				...state,
				action.component,
			];

		default:
			return state;
	}
};
