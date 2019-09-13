import PropTypes from 'prop-types';
import React from 'react';

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

export default class Dropdown extends React.PureComponent {
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
		this.props.onToggle( false );
	}

	onToggle( e ) {
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
		this.props.onToggle( ! expanded );
	}

	render() {
		const { children, size, type } = this.props;
		const { expanded } = this.state;

		const className = [
			'Dropdown',
			expanded && 'Dropdown--expanded',
			'btn',
			`btn--${ size }`,
			`btn--${ type }`,

			this.props.className,
		].filter( Boolean ).join( ' ' );

		return (
			<div className={ className }>
				<button
					className="Dropdown__trigger"
					onClick={ e => this.onToggle( e ) }
					type="button"
				>
					<Arrow />
				</button>

				<div className="Dropdown__content">
					{ children }
				</div>
			</div>
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
	onToggle: () => {},
};
