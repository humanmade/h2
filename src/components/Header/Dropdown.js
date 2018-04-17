import PropTypes from 'prop-types';
import React from 'react';

import './Dropdown.css';

export default class Dropdown extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = { expanded: false };
		this.documentClickListener = e => this.onDocumentClick( e );
	}

	componentWillUnmount() {
		document.removeEventListener( 'click', this.documentClickListener );
	}

	onDocumentClick( e ) {
		// Ignore events inside the dropdown.
		if ( ! this.root || this.root.contains( e.target ) ) {
			return;
		}

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
		const { children, label, reverse } = this.props;
		const { expanded } = this.state;

		const className = [
			this.props.className,
			'Dropdown',
			expanded && 'expanded',
			reverse && 'reverse',
		].filter( Boolean ).join( ' ' );

		return <div className={ className } ref={ ref => this.root = ref }>
			<button
				className="Dropdown-trigger"
				onClick={ e => this.onToggle( e ) }
				type="button"
			>
				{ label }
			</button>

			<div className="Dropdown-content">
				{ children }
			</div>
		</div>;
	}
}

Dropdown.propTypes = {
	className: PropTypes.string,
	label:     PropTypes.oneOfType( [
		PropTypes.element,
		PropTypes.string,
	] ).isRequired,
	reverse:   PropTypes.bool,
};

Dropdown.defaultProps = {
	className: '',
	reverse:   false,
	onToggle:  () => {},
};
