import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const HOVER_DELAY = 100;

const transition = {
	component: 'div',
	classNames: {
		enter: 'animate-hovercard-in',
		exit: 'animate-hovercard-out',
	},
	timeout: {
		enter: 100,
		exit: 100,
	},
};

function getPosition( target, width, preferRight ) {
	if ( ! target ) {
		return {};
	}

	const rect = target.getBoundingClientRect();
	if ( preferRight && rect.right + 12 + width + 16 <= document.documentElement.clientWidth ) {
		return {
			left: rect.right + window.pageXOffset - document.documentElement.clientLeft + 12,
			top: Math.max( 0, rect.top + rect.height / 2 - 20 ) + window.pageYOffset - document.documentElement.clientTop,
			rightOfTarget: true,
		};
	}

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

const CARD_CLASSES = [
	'Hovercard absolute z-20 rounded-lg border border-hm-beige bg-white text-hm-dark-grey',
	'shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
	'p-4',
	'text-base pointer-events-none',
	'flex flex-col',
	'max-w-[calc(100vw-32px)]',
].join( ' ' );

const POINTER_CLASSES = 'block absolute size-2.5 rotate-45 bg-white border-l border-hm-beige';

export function Card( { children, positions, width } ) {
	const cardStyle = {
		left: positions.left,
		top: positions.top,
		width,
	};
	const pointerStyle = {};
	pointerStyle.transform = positions.pointerOffset ? `translate( ${ positions.pointerOffset }px, 0 )` : null;

	return (
		<div
			className={ `${ CARD_CLASSES }${ positions.rightOfTarget ? '' : ' mt-3' }` }
			style={ cardStyle }
		>
			<div
				className={ `${ POINTER_CLASSES } ${ positions.rightOfTarget
					? 'top-[15px] -left-1.5 border-b'
					: 'top-[-6px] left-[calc(50%-5px)] border-t' }` }
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

	onMouseEnter = () => {
		if ( this.state.active || this.showTimer ) {
			return;
		}

		this.showTimer = setTimeout( () => {
			this.showTimer = null;
			this.setState( { active: true } );
		}, HOVER_DELAY );
	}

	onMouseLeave = () => {
		clearTimeout( this.showTimer );
		this.showTimer = null;
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
			preferRight,
			width,
		} = this.props;
		const { active } = this.state;

		const positions = getPosition( this.target, width, preferRight );

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
						onMouseEnter: this.onMouseEnter,
						onMouseLeave: this.onMouseLeave,
					}
				) }
			</React.Fragment>
		);
	}
}

Hovercard.defaultProps = {
	width: 425,
};
