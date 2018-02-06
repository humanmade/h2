import PropTypes from 'prop-types';
import React from 'react';

import './Completion.css';

const insert = ( item, props ) => `${ props.trigger }${ item } `;

const matcher = ( item, search ) => item.toLowerCase().indexOf( search.toLowerCase() ) >= 0;

const renderItem = ( { item, selected, onSelect } ) => {
	return <li
		key={ item }
		className={ selected ? 'selected' : null }
		onClick={ () => onSelect( item ) }
	>{ item }</li>;
};

export default class Completion extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			selected: 0,
			items:    props.items.filter( item => props.matcher( item, props.text ) ).slice( 0, 5 ),
		};
	}

	componentDidMount() {
		this.keyHandler = e => {
			switch ( e.key ) {
				case 'ArrowUp':
					e.preventDefault();
					this.setState( state => {
						const { selected } = this.state;
						const nextSelection = Math.max( 0, selected - 1 );
						return { selected: nextSelection };
					} );
					return;

				case 'ArrowDown':
					e.preventDefault();
					this.setState( state => {
						const { items, selected } = this.state;
						const nextSelection = Math.min( selected + 1, items.length - 1 );
						return { selected: nextSelection };
					} );
					return;

				case 'Tab':
				case 'Enter': {
					e.preventDefault();

					const { items, selected } = this.state;
					const item = items[ selected ];
					this.props.onSelect( this.props.insert( item, this.props ) );
					return;
				}

				case 'Escape':
					e.preventDefault();
					this.props.onCancel();
					return;
			}
		};

		window.addEventListener( 'keydown', this.keyHandler );
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			items: nextProps.items.filter( item => nextProps.matcher( item, nextProps.text ) ).slice( 0, 5 ),
		} );
	}

	componentWillUnmount() {
		if ( ! this.keyHandler ) {
			return;
		}

		window.removeEventListener( 'keydown', this.keyHandler );
	}

	render() {
		const {
			coords,
			insert,
			matcher,
			renderItem,
			text,
			onSelect,
		} = this.props;

		const { items } = this.state;

		if ( ! items.length ) {
			return null;
		}

		return <ol
			className="Completion"
			style={ {
				top: coords.top,
				left: coords.left,
			} }
		>
			{ items.map( ( item, idx ) => renderItem( {
				item,
				selected: idx === this.state.selected,
				onHover: () => this.setState( { selected: idx } ),
				onSelect: () => this.props.onSelect( insert( item, this.props ) ),
			} ) ) }
		</ol>;
	}
}

Completion.propTypes = {
	coords:   PropTypes.shape( {
		top:  PropTypes.number.isRequired,
		left: PropTypes.number.isRequired,
	} ).isRequired,
	items:    PropTypes.array.isRequired,
	text:     PropTypes.string.isRequired,
	trigger:  PropTypes.string.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSelect: PropTypes.func.isRequired,
};

Completion.defaultProps = {
	matcher,
	renderItem,
	insert,
};
