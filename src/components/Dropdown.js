import PropTypes from 'prop-types';
import React from 'react';

import Button from './Button';
import ButtonGroup from './ButtonGroup';

const CONTENT_CLASSES = [
	'hidden',
	'absolute left-0 right-0 top-full z-10',
	'm-0 -mt-px p-0 w-full',
	'max-h-[50vh] overflow-x-hidden overflow-y-scroll',
	'text-hm-warm-grey bg-white',
	'border border-solid border-hm-vibrant-blue',
	'rounded-bl rounded-br',
	'cursor-auto text-left',

	// Child buttons.
	'[&>.btn]:block [&>.btn]:w-full [&>.btn]:py-[0.3em] [&>.btn]:px-[0.5em]',
	'[&>.btn]:m-0 [&>.btn]:border-none [&>.btn]:rounded-none',
	'[&>.btn]:leading-[1.4] [&>.btn]:text-left [&>.btn]:whitespace-normal',
	'[&>.btn:hover]:border-none [&>.btn:hover]:bg-hm-vibrant-blue',
].join( ' ' );

const DropdownContext = React.createContext( null );

export const Arrow = () => (
	<svg
		className="w-[0.55em] align-middle"
		viewBox="0 0 12 7"
	>
		<title>Select other actions…</title>
		<path
			d="M1 1 6 6 11 1"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const DropdownContent = props => {
	const { children } = props;

	return (
		<DropdownContext.Consumer>
			{ context => {
				const { expanded, size, type, onToggle } = context;

				const triggerClasses = [
					'!h-full !m-0 !-ml-px',
					'!rounded-tl-none !rounded-bl-none',
					expanded && '!rounded-br-none',
				].filter( Boolean ).join( ' ' );

				const contentClasses = [
					CONTENT_CLASSES,
					expanded && '!block',
				].filter( Boolean ).join( ' ' );

				return (
					<div className="flex">
						<Button
							className={ triggerClasses }
							size={ size }
							type={ type }
							onClick={ onToggle }
						>
							<Arrow />
						</Button>

						<div className={ contentClasses }>
							{ children }
						</div>
					</div>
				);
			} }
		</DropdownContext.Consumer>
	);
};

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
			'Dropdown relative flex min-w-[5em]',
			'[&_.btn--small]:min-h-[31px]',
			'[&>.btn:first-child]:text-left [&>.btn:first-child]:grow',
			expanded && '[&>.btn:first-child]:rounded-bl-none',
			expanded && '[&>.btn:last-child]:rounded-br-none',

			this.props.className,
		].filter( Boolean ).join( ' ' );

		const context = {
			expanded,
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
