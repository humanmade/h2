import PropTypes from 'prop-types';
import React from 'react';

import './Completion.css';

export default class Completion extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			items: [],
			selected: 0,
		};
	}

	componentDidMount() {
		this.mounted = true;
		this.keyHandler = e => {
			// This is a bit of a hack, to migrate away from synchronous search
			// to support bundle splitting and newer emoji-mart's async search.
			this.getItems().then( items => {
				if ( ! this.mounted ) {
					// Do not update state after component unmounts.
					return;
				}
				this.setState( { items } );
			} );
			const { items } = this.state;
			if ( ! items || ! items.length ) {
				return;
			}

			const { selected } = this.state;
			switch ( e.key ) {
				case 'ArrowUp':
					e.preventDefault();
					this.setState( state => {
						const nextSelection = Math.max( 0, selected - 1 );
						return { selected: nextSelection };
					} );
					return;

				case 'ArrowDown':
					e.preventDefault();
					this.setState( state => {
						const nextSelection = Math.min( selected + 1, items.length - 1 );
						return { selected: nextSelection };
					} );
					return;

				case 'Tab':
				case 'Enter': {
					e.preventDefault();

					const item = items[ selected ];
					this.props.onSelect( this.props.insert( item, this.props ) );
					return;
				}

				case 'Escape':
					e.preventDefault();
					this.props.onCancel();
					return;

				default:
					// No-op
					return;
			}
		};

		window.addEventListener( 'keydown', this.keyHandler );
	}

	componentWillUnmount() {
		this.mounted = false;
		if ( ! this.keyHandler ) {
			return;
		}

		window.removeEventListener( 'keydown', this.keyHandler );
	}

	getItems() {
		return this.props.getItems( this.props.text, this.props.items, this.props.matcher );
	}

	render() {
		const {
			coords,
			insert,
			renderItem,
			onSelect,
		} = this.props;

		const { items } = this.state;

		if ( ! items || ! items.length ) {
			return null;
		}

		return (
			<ol
				className="Completion"
				style={ {
					top: coords.top,
					left: coords.left,
				} }
			>
				{ items.map( ( item, idx ) => renderItem( {
					key: item.colons,
					item,
					selected: idx === this.state.selected,
					onHover: () => this.setState( { selected: idx } ),
					onSelect: () => onSelect( insert( item, this.props ) ),
				} ) ) }
			</ol>
		);
	}
}

Completion.propTypes = {
	coords: PropTypes.shape( {
		top: PropTypes.number.isRequired,
		left: PropTypes.number.isRequired,
	} ).isRequired,
	items: PropTypes.array,
	text: PropTypes.string.isRequired,
	trigger: PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
};

Completion.defaultProps = {
	items: [],
	insert: ( item, props ) => `${ props.trigger }${ item } `,
	matcher: ( item, search ) => item.toLowerCase().indexOf( search.toLowerCase() ) >= 0,
	getItems: ( search, items, matcher ) => items.filter( item => matcher( item, search ) ).slice( 0, 5 ),
	renderItem: ( { item, selected, onSelect } ) => {
		return (
			<li
				key={ item.colons }
				className={ selected ? 'selected' : null }
				onClick={ () => onSelect( item ) }
			>{ item }</li>
		);
	},
};
