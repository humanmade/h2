import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import withSideEffect from 'react-side-effect';

import './Overlay.css';

let clickHandlers = [];
export function OverlayContainer() {
	return (
		<div
			className="Overlay"
			onClick={ () => clickHandlers.forEach( handler => handler() ) }
		/>
	);
}

class Overlay extends Component {
	render() {
		return (
			<Fragment>
				{ this.props.children }
			</Fragment>
		);
	}
}

Overlay.propTypes = {
	onClick: PropTypes.func,
};

const reducePropsToState = propsList => {
	return {
		isVisible: propsList.length > 0,
		clickHandlers: propsList.map( component => component.onClick ).filter( Boolean ),
	};
}

const handleChange = props => {
	document.body.classList.toggle( '--overlay-visible', props.isVisible );
	clickHandlers = props.clickHandlers;
};

export default withSideEffect(
	reducePropsToState,
	handleChange
)( Overlay );
