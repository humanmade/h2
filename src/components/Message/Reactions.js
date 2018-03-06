import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Picker } from 'emoji-mart'

import { withApiData } from '../../with-api-data';

import UserDisplayName from '../UserDisplayName';

import 'emoji-mart/css/emoji-mart.css';
import './Reactions.css';

export class Reactions extends Component {
	constructor( props ) {
		super( props );

		this.state = { isOpen: false }
	}

	onAddReaction( emoji ) {
		const body = {
			post: this.props.postId,
			type: emoji,
		};

		if ( this.props.commentId ) {
			body.comment = this.props.commentId;
		}

		this.props.fetch( '/h2/v1/reactions', {
			headers: {
				Accept:         'application/json',
				'Content-Type': 'application/json',
			},
			body:   JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json() ).then( post  => {
			this.props.refreshData();
		} );

	}

	onRemoveReaction( emoji ) {
		const reactions = this.props.reactions.data;

		let matches = reactions.filter( reaction => {
			return (
				reaction.author === this.props.currentUser.data.id &&
				reaction.type === emoji
			);
		} );

		if ( matches.length < 1 ) {
			return;
		}
		this.props.fetch( `/h2/v1/reactions/${ matches[0].id }`, { method: 'DELETE' } ).then( () => this.props.refreshData() );
	}

	/**
	 * Return the raw reactions grouped by emoji.
	 *
	 * @return {object} Reaction emoji : array of user IDs. eg 🌭:[ 1, 2 ].
	 */
	getGroupedReactions() {
		let reactions = {};
		if ( ! this.props.reactions.data ) {
			return reactions;
		}
		this.props.reactions.data.forEach( reaction => {
			if ( ! ( reaction.type in reactions ) ) {
				reactions[ reaction.type ] = [ reaction.author ];
			} else {
				reactions[ reaction.type ].push( reaction.author );
			}
		} );

		return reactions;
	}

	render() {
		const reactions = this.getGroupedReactions();
		if ( ! this.props.currentUser.data ) {
			return null;
		}

		return <div className="reactions">
			<div key="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( this.props.currentUser.data.id ) >= 0 ? true : false;
					return <button
						className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
						onClick={ () => this.toggleReaction( emoji ) }
						key={ emoji }
					>
						<span className="reactions__emoji" key="emoji">{ emoji }</span>
						<span className="reactions__count" key="count">{ users.length }</span>
						<span className="reactions__users" key="users">
							{ users.map( reactionAuthorId => {
								const user = this.props.users.data && this.props.users.data.filter( user => user.id === reactionAuthorId );
								return <UserDisplayName
									className="reactions__user"
									userId={ reactionAuthorId }
									userName={ user && user.length > 0 ? user[0].name : 'Unknown' }
									key={ this.props.postId + reactionAuthorId }
								/>
							} ) }
						</span>
					</button>
				} ) }
			</div>
			<button
				className={ 'btn btn--small btn--tertiary' + ( this.props.reactions.isLoading ? ' loading' : '' ) }
				onClick={ value => this.setState( { isOpen: ! this.state.isOpen  } ) }
				key="button"
				disabled={ this.props.reactions.isLoading }
			>
				{ this.props.reactions.isLoading ?
					<span className="loading loading--active"></span>
					:
					<span className="icon icon--smiley-wink">Add reaction</span>
				}
			</button>
			{ this.state.isOpen && (
				<Picker
					key="picker"
					onClick={ data => {
						this.setState( { isOpen: false } );
						this.toggleReaction( data.native );
					}}
					title={ false }
					emoji="upside_down_face"
					autoFocus={ true }
					color="#D24632"
					set="twitter"
				/>
			)}
		</div>;
	}

	toggleReaction( emoji, reactionUserId ) {
		const reactions = this.getGroupedReactions();
		if (
			! ( emoji in reactions ) ||
			reactions[ emoji ].indexOf( this.props.currentUser.data.id ) < 0
		) {
			if ( Object.keys( reactions ).length >= 10 ) {
				alert( 'Sorry! You are only allowed 10 reactions per post!' );
				return;
			}

			this.onAddReaction( emoji );
		} else {
			this.onRemoveReaction( emoji );
		}
	}
}

export default withApiData( props => ( {
	reactions:   `/h2/v1/reactions?post=${ props.postId }${ props.commentId ? `&comment=${ props.commentId }` : '' }`,
	currentUser: '/wp/v2/users/me',
	users:       '/wp/v2/users?per_page=100',
} ) )( Reactions );

Reactions.propTypes = {
	userId:    PropTypes.number,
	postId:    PropTypes.number.isRequired,
	commentId: PropTypes.number,
	reactions: PropTypes.object.isRequired,
};

Reactions.defaultProps = {
	userId:    0,
	isLoading: false,
}
