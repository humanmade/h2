import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Hovercard.css';

const HOVER_DELAY = 100;

const transition = {
	component: 'div',
	classNames: 'Hovercard-Transition',
	timeout: {
		enter: 100,
		exit: 100,
	},
};

function getPosition( target, width ) {
	if ( ! target ) {
		return {};
	}

	let rect = target.getBoundingClientRect();

	let style = {
		top: rect.top + window.pageYOffset - document.documentElement.clientTop,
		left: rect.left + window.pageXOffset - document.documentElement.clientLeft,
	};

	// Ofset by the size of the element itself.
	style.top += target.offsetHeight;

	// Point to the centre.
	style.left += target.offsetWidth / 2 - width / 2;

	// Keep on the screen.
	const originalLeft = style.left;
	style.top = Math.max( style.top, 16 );
	style.left = Math.max( style.left, 16 );

	// Offset the pointer back.
	const diff = originalLeft - style.left;
	style.pointerOffset = diff;

	// Move pointer back onscreen if small window breakpoint has constrained width.
	if ( document.documentElement.clientWidth < width + style.left * 2 ) {
		style.pointerOffset += ( width - document.documentElement.clientWidth ) / 2 + style.left;
	}

	return style;
}

class CardPortal extends React.Component {
	constructor( props ) {
		super( props );

		this.container = document.createElement( 'div' );
	}

	componentDidMount() {
		document.body.appendChild( this.container );
	}

	componentWillUnmount() {
		document.body.removeChild( this.container );
	}

	render() {
		return ReactDOM.createPortal(
			this.props.children,
			this.container
		);
	}
}

export function Card( { children, positions, width } ) {
	const cardStyle = {
		left: positions.left,
		top: positions.top,
		width,
	};
	const pointerStyle = {};
	pointerStyle.transform = positions.pointerOffset ? `translate( ${ positions.pointerOffset}px, 0 )` : null;

	return (
		<div
			className="Hovercard-Card"
			style={ cardStyle }
		>
			<div
				className="Hovercard-Card-pointer"
				style={ pointerStyle }
			/>

			{ children }
		</div>
	);
}

Card.defaultProps = {
	width: 425,
};

export default class Hovercard extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { active: false };

		this.target = null;
	}

	componentWillUnmount() {
		if ( this.showTimer ) {
			clearTimeout( this.showTimer );
		}
	}

	onMouseOver = () => {
		if ( this.state.active ) {
			return;
		}

		this.showTimer = setTimeout( () => {
			this.showTimer = null;
			this.setState( { active: true } );
		}, HOVER_DELAY );
	}

	onMouseOut = () => {
		if ( this.showTimer ) {
			clearTimeout( this.showTimer );
		}
		this.setState( { active: false } );
	}

	onUpdateRef = ref => {
		if ( ! ref ) {
			this.target = null;
		} else if ( ref instanceof HTMLElement ) {
			this.target = ref;
		} else {
			this.target = ReactDOM.findDOMNode( ref );
		}
	}

	render() {
		const {
			cardContent: CardContent,
			width,
		} = this.props;
		const { active } = this.state;

		const positions = getPosition( this.target, width );

		return (
			<React.Fragment>
				<CSSTransition
					{ ...transition }
					in={ !! ( active && this.target ) }
					mountOnEnter
					unmountOnExit
				>
					{ () => (
						<CardPortal>
							<Card
								positions={ positions }
								width={ width }
							>
								<CardContent />
							</Card>
						</CardPortal>
					) }
				</CSSTransition>

				{ React.cloneElement(
					React.Children.only( this.props.children ),
					{
						ref: this.onUpdateRef,
						onMouseOver: this.onMouseOver,
						onMouseOut: this.onMouseOut,
					}
				) }
			</React.Fragment>
		);
	}
}

Hovercard.defaultProps = {
	width: 425,
};
