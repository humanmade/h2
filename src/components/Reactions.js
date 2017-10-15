import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Picker } from 'emoji-mart'

import 'emoji-mart/css/emoji-mart.css';
import './Reactions.css';

export default class Reaction extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false
		}
	}

	render() {
		const { reactions, userId } = this.props;

		if ( ! userId || userId <= 0 ) {
			return null;
		}

		return <div className="reactions">
			<button
				className="btn btn--small btn--tertiary"
				onClick={ value => this.setState({ isOpen: ! this.state.isOpen  } ) }
				key="button"
			>
				Add reaction
			</button>
			<div key="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, count ] ) => {
					let isActive = reactions[ emoji ].indexOf( userId ) >= 0 ? true : false;
					return <button
						className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
						onClick={ () => this.toggleReaction( emoji ) }
						key={ emoji }
					>
						<span className="reactions__emoji">{ emoji }</span>
						<span className="reactions__count">{ count.length }</span>
					</button>
				})}
			</div>
			{ this.state.isOpen && (
				<Picker
					key="picker"
					onClick={ data => {
						this.setState( { isOpen: false } );
						this.toggleReaction( data.native );
					}}
					title={ false }
				/>
			)}
		</div>;
	}

	toggleReaction( emoji ) {
		const { reactions, onChangeReactions, userId } = this.props;

		if ( ! ( emoji in reactions ) ) {
			reactions[ emoji ] = [ userId ];
		} else if ( reactions[ emoji ].indexOf( userId ) < 0 ) {
			reactions[ emoji ].push( userId );
		} else {
			let index = reactions[ emoji ].indexOf( userId );
			if ( index > -1 ) {
	 			reactions[ emoji ].splice( index, 1 );
			}

			if ( reactions[ emoji ].length < 1 ) {
				delete reactions[ emoji ];
			}
		}

		onChangeReactions( reactions );
	}
}


Reaction.propTypes = {
	onChangeReactions: PropTypes.func.isRequired,
	reactions: PropTypes.object.isRequired,
};

Reaction.defaultProps = {
	userId: 0,
}
