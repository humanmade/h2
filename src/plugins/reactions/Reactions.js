import { withArchive } from '@humanmade/repress';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import EmojiPicker from '../../components/EmojiPicker';
import { withCurrentUser } from '../../hocs';
import { reactions } from '../../types';

import './Reactions.css';

function UserDisplayName( props ) {
	if ( props.userId === 0 ) {
		return null;
	}

	return (
		<span className="block text-white">
			{ props.userName }
		</span>
	);
}

const Emoji = props => {
	const custom = window.H2Data.site.emoji[ props.type ];
	if ( custom ) {
		return (
			<img
				alt={ custom.colons }
				className="h-[1em] max-h-[1em]"
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

		this.props.onCreate( body ).then( () => {
			this.setState( { isLoading: false } );
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
		this.props.onDelete( matches[0].id ).then( () => {
			this.props.onLoad();
		} );
	}

	/**
	 * Return the raw reactions grouped by emoji.
	 *
	 * @returns {object} Reaction emoji : array of user IDs. eg 🌭:[ 1, 2 ].
	 */
	getGroupedReactions() {
		let reactions = {};
		if ( ! this.props.reactions ) {
			return reactions;
		}
		this.props.reactions.forEach( reaction => {
			if ( ! ( reaction.type in reactions ) || reactions[ reaction.type ].includes( reaction.author ) ) {
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

		const loading = this.props.loading || this.state.isLoading;

		return (
			<div className="reactions flex flex-wrap relative">
				{ Object.entries( reactions ).map( ( [ emoji, users ] ) => {
					let isActive = reactions[ emoji ].indexOf( this.props.currentUser.id ) >= 0 ? true : false;
					return (
						<Button
							key={ emoji }
							className={ [
								'group whitespace-nowrap relative mb-2 h-[31px]',
								isActive && 'bg-[rgba(125,201,218,0.1)] hover:bg-[rgba(125,201,218,0.1)]',
							].filter( Boolean ).join( ' ' ) }
							type="tertiary"
							onClick={ () => this.toggleReaction( emoji ) }
						>
							<span className="inline-block ml-[0.1em] mr-1 relative top-[2.5px]" key="emoji">
								<Emoji type={ emoji } />
							</span>
							<span className={ `ml-1 mr-[0.1em] text-sm ${ isActive ? 'text-hm-warm-grey' : 'text-[#AAA]' }` } key="count">{ users.length }</span>
							<span className="hidden group-hover:block group-focus:block absolute top-[calc(100%+5px)] left-0 bg-black/60 px-2 py-1 rounded-xs text-sm z-10 text-left" key="users">
								{ users.map( reactionAuthorId => {
									const user = this.props.users && this.props.users.filter( user => user.id === reactionAuthorId );
									return (
										<UserDisplayName
											userId={ reactionAuthorId }
											userName={ user && user.length > 0 ? user[0].name : 'Unknown' }
											key={ this.props.postId + reactionAuthorId }
										/>
									);
								} ) }
							</span>
						</Button>
					);
				} ) }
				<Button
					className={ 'reactions__add-reaction ' + ( loading ? ' loading' : '' ) }
					disabled={ loading }
					type="tertiary"
					onClick={ () => this.setState( { isOpen: ! this.state.isOpen  } ) }
				>
					{ loading ? (
						<span className="loading loading--active m-0"></span>
					) : (
						<span className="icon icon--smiley-wink">Add reaction</span>
					) }
				</Button>
				{ this.state.isOpen && (
					<EmojiPicker
						onClose={ () => this.setState( { isOpen: false } ) }
						onSelect={ data => {
							this.setState( { isOpen: false } );
							this.toggleReaction( data.native || data.name );
						} }
					/>
				) }
			</div>
		);
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
	users: state.users.posts,
} );
const mapDispatchToProps = dispatch => ( {
	onCreate: data => dispatch( reactions.createSingle( data ) ),
	onDelete: id => dispatch( reactions.deleteSingle( id ) ),
} );
const mapPropsToId = props => {
	const post = props.postId;
	const comment = props.commentId || null;
	const id = [ post, comment ].filter( Boolean ).join( '+' );
	reactions.registerArchive( id, {
		post,
		comment,
	} );
	return id;
};
const mapDataToProps = data => ( {
	loading: data.loading,
	reactions: data.posts,
} );

export default withArchive(
	reactions,
	state => state.reactions,
	mapPropsToId,
	{ mapDataToProps }
)(
	connect( mapStateToProps, mapDispatchToProps )( withCurrentUser( Reactions ) )
);

Reactions.propTypes = {
	userId: PropTypes.number,
	postId: PropTypes.number.isRequired,
	commentId: PropTypes.number,
	reactions: PropTypes.array,
};

Reactions.defaultProps = {
	userId: 0,
	isLoading: false,
	reactions: [],
};
