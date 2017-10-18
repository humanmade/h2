import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Picker } from 'emoji-mart'
import UserDisplayName from '../containers/UserDisplayName';

import 'emoji-mart/css/emoji-mart.css';
import './Reactions.css';

export default class Reaction extends Component {
	constructor( props ) {
		super( props );

		this.state = { isOpen: false }
	}

	render() {
		const { reactions, userId } = this.props;

		if ( ! userId || userId <= 0 ) {
			return null;
		}

		return <div className="reactions">
			<button
				className="btn btn--small btn--tertiary"
				onClick={ value => this.setState( { isOpen: ! this.state.isOpen  } ) }
				key="button"
			>
				<span className="icon icon--smiley-wink">Add reaction</span>
			</button>
			<div key="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( userId ) >= 0 ? true : false;
					return <button
						className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
						onClick={ () => this.toggleReaction( emoji ) }
						key={ emoji }
					>
						<span className="reactions__emoji" key="emoji">{ emoji }</span>
						<span className="reactions__count" key="count">{ users.length }</span>
						<span className="reactions__users" key="users">
							{ users.map( reactionAuthorId => {
								return <UserDisplayName
									className="reactions__user"
									userId={ reactionAuthorId }
									key={ this.props.postId + reactionAuthorId }
								/>
							} ) }
						</span>
					</button>
				} ) }
			</div>
			{ this.state.isOpen && (
				<Picker
					key="picker"
					onClick={ data => {
						this.setState( { isOpen: false } );
						this.toggleReaction( data.native );
					}}
					title={ false }
					emoji=":upside_down_face:"
					native={ true }
					autofFocus={ true }
				/>
			)}
		</div>;
	}

	toggleReaction( emoji, reactionUserId ) {
		const { reactions, onAddReaction, onRemoveReaction, userId } = this.props;

		if (
			! ( emoji in reactions ) ||
			reactions[ emoji ].indexOf( userId ) < 0
		) {
			onAddReaction( emoji );
		} else {
			onRemoveReaction( emoji );
		}
	}
}

Reaction.propTypes = {
	userId:           PropTypes.number,
	postId:           PropTypes.number.isRequired,
	reactions:        PropTypes.object.isRequired,
	onAddReaction:    PropTypes.func.isRequired,
	onRemoveReaction: PropTypes.func.isRequired,
};

Reaction.defaultProps = { userId: 0 }
