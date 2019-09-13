import PropTypes from 'prop-types';
import React from 'react';

import ButtonGroup from './ButtonGroup';

import './Dropdown.css';

export const Arrow = () => (
	<svg
		className="Dropdown__arrow"
		viewBox="0 0 9 9"
	>
		<title>Select other actions…</title>
		<polygon
			points="0,0 9,0 4.5,4.5"
			fill="currentColor"
		/>
	</svg>
);

const DropdownContext = React.createContext( null );

export const DropdownContent = props => {
	const { children } = props;

	return (
		<DropdownContext.Consumer>
			{ context => {
				const { size, type, onToggle } = context;
				const className = [
					'btn',
					`btn--${ size }`,
					`btn--${ type }`,
				].join( ' ' );

				return (
					<div className={ className }>
						<button
							className="Dropdown__trigger"
							onClick={ onToggle }
							type="button"
						>
							<Arrow />
						</button>

						<div className="Dropdown__content">
							{ children }
						</div>
					</div>
				);
			} }
		</DropdownContext.Consumer>
	);
}

export class Dropdown extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = { expanded: false };
		this.documentClickListener = e => this.onDocumentClick( e );
	}

	componentWillUnmount() {
		document.removeEventListener( 'click', this.documentClickListener );
	}

	onDocumentClick() {
		// Remove handler.
		document.removeEventListener( 'click', this.documentClickListener );

		this.setState( { expanded: false } );
	}

	onToggle = e => {
		e.preventDefault();

		const { expanded } = this.state;
		if ( ! expanded ) {
			// Hide on the next click anywhere else.
			document.addEventListener( 'click', this.documentClickListener );
		} else if ( this.documentClickListener ) {
			// Remove handler.
			document.removeEventListener( 'click', this.documentClickListener );
		}

		this.setState( { expanded: ! expanded } );
	}

	render() {
		const { children, size, type } = this.props;
		const { expanded } = this.state;

		const className = [
			'Dropdown',
			expanded && 'Dropdown--expanded',

			this.props.className,
		].filter( Boolean ).join( ' ' );

		const context = {
			size,
			type,
			onToggle: this.onToggle,
		};

		return (
			<DropdownContext.Provider value={ context }>
				<ButtonGroup className={ className }>
					{ children }
				</ButtonGroup>
			</DropdownContext.Provider>
		);
	}
}

Dropdown.propTypes = {
	className: PropTypes.string,
	size: PropTypes.string,
	type: PropTypes.string,
};

Dropdown.defaultProps = {
	className: '',
	size: 'small',
	type: 'secondary',
};
