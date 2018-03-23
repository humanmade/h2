import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Hovercard.css';

const HOVER_DELAY = 100;

const transition = {
	component:  'div',
	classNames: 'Hovercard-Transition',
	timeout:    {
		enter: 100,
		exit:  100,
	},
};

function getPosition( target, width ) {
	if ( ! target ) {
		return {};
	}

	let rect = target.getBoundingClientRect();

	let position = {
		top:  rect.top + window.pageYOffset - document.documentElement.clientTop,
		left: rect.left + window.pageXOffset - document.documentElement.clientLeft,
	};

	// Ofset by the size of the element itself.
	position.top += target.offsetHeight;

	// Point to the centre.
	position.left += target.offsetWidth / 2 - width / 2;

	// Keep on the screen.
	position.top = Math.max( position.top, 16 );
	position.left = Math.max( position.left, 16 );

	return position;
}

class CardPortal extends React.Component {
	constructor( props ) {
		super( props );

		this.container = document.createElement( 'div' );
	}

	componentWillMount() {
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

export default class Hovercard extends React.Component {
	constructor( props ) {
		super( props );

		this.state = { active: false };

		this.target = null;
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

	render() {
		const {
			cardContent: Card,
			width,
		} = this.props;
		const { active } = this.state;

		return <React.Fragment>
			<CSSTransition
				{...transition}
				in={ !! ( active && this.target ) }
				mountOnEnter={ true }
				unmountOnExit={ true }
			>
				{ () => <CardPortal>
					<div
						className="Hovercard-Card"
						style={ { width, ...getPosition( this.target, width ) } }
					>
						<div
							className="Hovercard-Card-pointer"
						/>
						<Card />
					</div>
				</CardPortal> }
			</CSSTransition>

			{ React.cloneElement(
				React.Children.only( this.props.children ),
				{
					ref:         ref => this.target = ref,
					onMouseOver: this.onMouseOver,
					onMouseOut:  this.onMouseOut,
				}
			) }
		</React.Fragment>;
	}
}

Hovercard.defaultProps = { width: 300 };
