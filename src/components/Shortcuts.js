/**
 * Shortcuts component.
 *
 * Shortcuts declaratively adds keyboard shortcuts. Shortcuts are specified via
 * the `keys` prop to Shortcuts:
 *
 *     <Shortcuts keys={ { "ctrl+s": () => console.log( 'save' ) } } />
 *
 * You can wrap your component in a Shortcuts instance if you want:
 *
 *      <Shortcuts><div>Hi!</div>
 *
 * Any key combination or sequence allowed by Mousetrap is allowed:
 * https://craig.is/killing/mice
 *
 * Each value in the `keys` prop can either be a callback (which receives the
 * event object) or an object with `allowInInput` and `callback` keys.
 *
 * - `allowInInput` (boolean, default `false`): Should the callback fire if an
 *   input is focussed?
 */
import { isFunction } from 'lodash';
import Mousetrap from 'mousetrap';
import PropTypes from 'prop-types';
import React from 'react';
import withSideEffect from 'react-side-effect';

const shortcutState = {
	currentBindings: {},
	globalCallbacks: {},
};

class Shortcuts extends React.Component {
	render() {
		if ( ! this.props.children ) {
			return null;
		}

		return <React.Fragment>
			{ this.props.children }
		</React.Fragment>;
	}
}

Shortcuts.propTypes = {
	keys: PropTypes.objectOf(
		PropTypes.oneOfType( [
			PropTypes.func,
			PropTypes.shape( {
				callback: PropTypes.func.isRequired,
				allowInInput: PropTypes.bool,
			} ),
		] )
	),
}

const defaultStopCallback = Mousetrap.prototype.stopCallback;
Mousetrap.prototype.stopCallback = function ( e, element, combo, sequence ) {
	if ( shortcutState.globalCallbacks[ combo ] || shortcutState.globalCallbacks[ sequence ] ) {
		return false;
	}

	return defaultStopCallback.call( this, e, element, combo );
};

const reducePropsToState = propsList => {
	// Collect all the shortcuts we can.
	let keys = {};
	propsList.forEach( props => {
		if ( ! props.keys ) {
			return;
		}

		Object.keys( props.keys ).map( key => {
			if ( isFunction( props.keys[ key ] ) ) {
				keys[ key ] = {
					allowInInput: false,
					callback: props.keys[ key ],
				};
			} else {
				keys[ key ] = {
					allowInInput: false,
					...props.keys[ key ],
				};
			}
		} );
	} );
	return keys;
}

const handleStateChange = state => {
	const toUnbind = { ...shortcutState.currentBindings };
	shortcutState.globalCallbacks = {};
	Object.keys( state ).forEach( key => {
		const opts = state[ key ];

		// Note which are global.
		if ( opts.allowInInput ) {
			shortcutState.globalCallbacks[ key ] = true;
		}

		// Bind the callback (this overwrites previous ones if set)
		Mousetrap.bind( key, opts.callback );

		// Remove from remaining list.
		delete toUnbind[ key ];
	} );

	Object.keys( toUnbind ).map( key => {
		Mousetrap.unbind( key );
	} );
	shortcutState.currentBindings = state;
};

export default withSideEffect( reducePropsToState, handleStateChange )( Shortcuts );
