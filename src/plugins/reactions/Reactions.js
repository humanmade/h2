import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Picker } from 'emoji-mart'

import { withApiData } from '../../with-api-data';

import UserDisplayName from '../../components/UserDisplayName';

import 'emoji-mart/css/emoji-mart.css';
import './Reactions.css';

const Emoji = props => {
	const custom = window.H2Data.site.emoji[ props.type ];
	if ( custom ) {
		return (
			<img
				alt={ custom.colons }
				className="Reactions-custom"
				src={ custom.imageUrl }
			/>
		);
	}

	return props.type;
};

export class Reactions extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isLoading: false,
			isOpen: false,
		};
	}

	onAddReaction( emoji ) {
		const body = {
			post: this.props.postId,
			type: emoji,
		};

		if ( this.props.commentId ) {
			body.comment = this.props.commentId;
		}

		this.setState( { isLoading: true } );

		this.props.fetch( '/h2/v1/reactions', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify( body ),
			method: 'POST',
		} ).then( r => r.json() ).then( post  => {
			this.setState( { isLoading: false } );
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

		const loading = this.props.reactions.isLoading || this.state.isLoading;

		return (
			<div className="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( this.props.currentUser.data.id ) >= 0 ? true : false;
					return (
						<button
							className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
							onClick={ () => this.toggleReaction( emoji ) }
							key={ emoji }
						>
							<span className="reactions__emoji" key="emoji">
								<Emoji type={ emoji } />
							</span>
							<span className="reactions__count" key="count">{ users.length }</span>
							<span className="reactions__users" key="users">
								{ users.map( reactionAuthorId => {
									const user = this.props.users.data && this.props.users.data.filter( user => user.id === reactionAuthorId );
									return (
										<UserDisplayName
											className="reactions__user"
											userId={ reactionAuthorId }
											userName={ user && user.length > 0 ? user[0].name : 'Unknown' }
											key={ this.props.postId + reactionAuthorId }
										/>
									);
								} ) }
							</span>
						</button>
					);
				} ) }
				<button
					className={ 'btn btn--small btn--tertiary' + ( loading ? ' loading' : '' ) }
					onClick={ value => this.setState( { isOpen: ! this.state.isOpen  } ) }
					key="button"
					disabled={ loading }
				>
					{ loading ? (
						<span className="loading loading--active"></span>
					) : (
						<span className="icon icon--smiley-wink">Add reaction</span>
					) }
				</button>
				{ this.state.isOpen && (
					<Picker
						key="picker"
						onClick={ data => {
							this.setState( { isOpen: false } );
							this.toggleReaction( data.native || data.name );
						} }
						title={ false }
						emoji="upside_down_face"
						autoFocus={ true }
						color="#D24632"
						custom={ window.H2Data.site.emoji }
						set="twitter"
					/>
				)}
			</div>
		);
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
	reactions: `/h2/v1/reactions?post=${ props.postId }${ props.commentId ? `&comment=${ props.commentId }` : '' }`,
	currentUser: '/wp/v2/users/me',
	users: '/wp/v2/users?per_page=100',
} ) )( Reactions );

Reactions.propTypes = {
	userId: PropTypes.number,
	postId: PropTypes.number.isRequired,
	commentId: PropTypes.number,
	reactions: PropTypes.object.isRequired,
};

Reactions.defaultProps = {
	userId: 0,
	isLoading: false,
}
