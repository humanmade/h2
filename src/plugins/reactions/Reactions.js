import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Picker } from 'emoji-mart'

import { reactions, users } from '../../types';

import UserDisplayName from '../../components/UserDisplayName';

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

		this.props.onCreate( body ).then( () => {
			this.props.onLoad();
		} );

	}

	onRemoveReaction( emoji ) {
		const reactions = this.props.reactions;

		let matches = reactions.filter( reaction => {
			return (
				reaction.author === this.props.currentUser.id &&
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
		if ( ! this.props.reactions ) {
			return reactions;
		}
		this.props.reactions.forEach( reaction => {
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
		if ( ! this.props.currentUser ) {
			return null;
		}

		return <div className="reactions">
			<div key="reactions">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( this.props.currentUser.id ) >= 0 ? true : false;
					return <button
						className={ 'btn btn--small btn--tertiary' + ( isActive ? ' btn--active' : '' ) }
						onClick={ () => this.toggleReaction( emoji ) }
						key={ emoji }
					>
						<span className="reactions__emoji" key="emoji">{ emoji }</span>
						<span className="reactions__count" key="count">{ users.length }</span>
						<span className="reactions__users" key="users">
							{ users.map( reactionAuthorId => {
								const user = this.props.users && this.props.users.filter( user => user.id === reactionAuthorId );
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
				className={ 'btn btn--small btn--tertiary' + ( this.props.loading ? ' loading' : '' ) }
				onClick={ value => this.setState( { isOpen: ! this.state.isOpen  } ) }
				key="button"
				disabled={ this.props.loading }
			>
				{ this.props.loading ?
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
			reactions[ emoji ].indexOf( this.props.currentUser.id ) < 0
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

const mapStateToProps = state => ( {
	currentUser: users.getSingle( state.users, state.users.current ),
	users:       state.users.posts,
} );
const mapDispatchToProps = ( dispatch ) => ( {
	onCreate: data => dispatch( reactions.createSingle( data ) )
} );
const mapPropsToId = props => {
	const post = props.postId;
	const comment = props.commentId || null;
	const id = [ post, comment ].filter( Boolean ).join( '+' );
	reactions.registerArchive( id, { post, comment } );
	return id;
};
const mapDataToProps = data => ( {
	loading:   data.loading,
	reactions: data.posts,
} );

export default withArchive(
	reactions,
	state => state.reactions,
	mapPropsToId,
	{ mapDataToProps }
)(
	connect( mapStateToProps, mapDispatchToProps ) ( Reactions )
);

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
